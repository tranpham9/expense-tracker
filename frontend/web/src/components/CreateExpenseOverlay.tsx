import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { currentTrip } from "../Signals/Trip";
import { ExpensesCreatePayload } from "../utility/api/types/Payloads";

export default function CreateExpense({ isCreateExpenseOverlayVisible, onSuccessfulCreate = () => {} }: { isCreateExpenseOverlayVisible: Signal<boolean>; onSuccessfulCreate?: () => void }) {
    useSignals();

    // FIXME: need to do input validation to ensure that name and cost are filled!
    const isProcessing = useSignal(false);
    const name = useSignal("");
    const description = useSignal("");
    const cost = useSignal("$0.00");
    const errorMessage = useSignal("");
    const memberIds = useSignal<string[]>([]);

    const attemptCreateExpense = () => {
        const expenseInfo: ExpensesCreatePayload = {
            name: name.value,
            description: description.value,
            cost: parseFloat(cost.value.substring(1)),
            tripId: currentTrip.value!._id,
            memberIds: memberIds.value,
        };
        request(
            "expenses/create",
            expenseInfo,
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isCreateExpenseOverlayVisible.value = false;
                onSuccessfulCreate();
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    // FIXME: make name be required non-empty; the API doesn't allow it to be empty
    return (
        <Modal isOpen={isCreateExpenseOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Create Expense</Typography>
                <br />
                <StyledInput
                    label="Name"
                    // error={error}
                    onChange={(event) => {
                        name.value = event.target.value;
                    }}
                    onEnterKey={attemptCreateExpense}
                />
                <br />
                <StyledInput
                    label="Description"
                    required={false}
                    useMultiline={true}
                    // error={error}
                    onChange={(event) => {
                        description.value = event.target.value;
                    }}
                />
                <br />
                {/* TODO: add cost input (customize it to only allow certain characters at certain spots) */}
                {/* TODO: add members input (use select with checkmarks and chips: https://mui.com/material-ui/react-select/ ) */}
                {errorMessage.value && (
                    <Typography
                        variant="body1"
                        mt={0}
                        mb={1}
                        color="error.main"
                    >
                        {errorMessage.value}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    disabled={isProcessing.value}
                    sx={{ m: "10px" }}
                    onClick={attemptCreateExpense}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
