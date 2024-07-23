import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, Checkbox, Chip, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { currentTrip } from "../Signals/Trip";
import { ExpensesCreatePayload } from "../utility/api/types/Payloads";
import { Member } from "../utility/api/types/Responses";

export default function CreateExpenseOverlay({
    isCreateExpenseOverlayVisible,
    tripMembers,
    onSuccessfulCreate = () => {},
}: {
    isCreateExpenseOverlayVisible: Signal<boolean>;
    tripMembers: Signal<Member[]>;
    onSuccessfulCreate?: () => void;
}) {
    useSignals();

    // FIXME: need to do input validation to ensure that name and cost are filled!
    const isProcessing = useSignal(false);
    const name = useSignal("");
    const description = useSignal("");
    const cost = useSignal("");
    const errorMessage = useSignal("");
    const memberIds = useSignal<string[]>([]);
    const canCreate = useComputed(() => name.value && isCostValid() && !isProcessing.value);

    const attemptCreateExpense = () => {
        if (!canCreate.value) {
            console.log("Can't create expense");
            return;
        }

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

    const isCostValid = () => !!cost.value.match(/^\$([0-9]+|[0-9]*\.[0-9]{2})$/);

    useSignalEffect(() => {
        console.log("list of selected members for expense changed to", memberIds.value);
    });

    useSignalEffect(() => {
        if (!isCreateExpenseOverlayVisible.value) {
            console.log("create expense overlay was closed; resetting all values");

            // reset all values (with the way that the StyledInputs work, they are one-way with information; their values changing updates these signals but not the other way around; accordingly, these all need to get wiped)
            name.value = "";
            description.value = "";
            cost.value = "";
            errorMessage.value = "";
            memberIds.value = [];
        }
    });

    const MembersSelector = () => {
        // NOTE: this needs to be called here due to how it is using the signals directly (instead of just having the changed value passed in; it updates the values itself + relies on it as well)!
        useSignals();

        return (
            <FormControl sx={{ m: 1, width: "90%" }}>
                <InputLabel>Participants</InputLabel>
                <Select
                    multiple
                    input={<OutlinedInput label="Participants" />}
                    value={memberIds.value}
                    onChange={(event) => {
                        const value = event.target.value;
                        console.log(value);
                        // this is to handle autofill returning a stringified result as per the MUI docs
                        memberIds.value = typeof value === "string" ? value.split(",") : value;
                    }}
                    renderValue={(selected) => {
                        console.log("selected", selected);
                        return (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((value) => {
                                    const member = tripMembers.value.find((tripMember) => tripMember._id === value);
                                    return (
                                        <Chip
                                            key={value}
                                            // label={`${member?.name || ""} (${member?.email || ""})`}
                                            label={member?.name || ""}
                                        />
                                    );
                                })}
                            </Box>
                        );
                    }}
                >
                    {tripMembers.value.map((tripMember) => (
                        <MenuItem
                            key={tripMember._id}
                            value={tripMember._id}
                            // style={{ fontWeight: memberIds.value.includes(tripMember._id) ? "bold" : "regular" }}
                            // style={{ color: memberIds.value.includes(tripMember._id) ? "red" : "blue" }}
                        >
                            {/* {tripMember.name} ({tripMember.email}) */}
                            <Checkbox checked={memberIds.value.includes(tripMember._id)} />
                            {tripMember.name}
                            {/* I don't think this is needed? */}
                            {/* <ListItemText primary={tripMember.name} /> */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
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
                    error={name.value ? "" : "Must be nonempty"}
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
                <StyledInput
                    label="Cost"
                    error={isCostValid() ? "" : "Must be a valid USD format"}
                    // onKeyDown={(event) => {
                    //     event.key
                    // }}
                    onChange={(event) => {
                        if (!event.target.value) {
                            return;
                        }
                        // cost.value = event.target.value;
                        // if (!cost.value && event.target.value !== "$") {
                        if (!event.target.value.startsWith("$")) {
                            event.target.value = `$${event.target.value}`;
                        }

                        // if(event.target.value.match(/[^0-9.$]/)) {
                        //     event.target.value = cost.value;
                        // }

                        if (event.target.value.match(/^\$[0-9]*(\.[0-9]{0,2})?$/)) {
                            cost.value = event.target.value;
                        } else {
                            event.target.value = cost.value;
                        }
                    }}
                    onEnterKey={attemptCreateExpense}
                />
                <br />
                <MembersSelector />
                <br />
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
                    disabled={!canCreate.value}
                    sx={{ m: "10px" }}
                    onClick={attemptCreateExpense}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
