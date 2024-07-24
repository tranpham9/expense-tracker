import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, Checkbox, Chip, CircularProgress, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { ExpensesUpdatePayload } from "../utility/api/types/Payloads";
import { Expense, Member } from "../utility/api/types/Responses";

export default function EditExpenseOverlay({
    expenseToEdit,
    tripMembers,
    onSuccessfulEdit = () => {},
}: {
    expenseToEdit: Signal<Expense | null>;
    tripMembers: Signal<Member[]>;
    onSuccessfulEdit?: () => void;
}) {
    useSignals();

    // can't use computed for this since the modal needs to be able to edit this signal
    const isEditExpenseOverlayVisible = useSignal(false);

    const isProcessing = useSignal(false);

    const name = useSignal("");
    const description = useSignal("");
    const cost = useSignal("");
    const isCostValid = useComputed(() => !!cost.value.match(/^\$([0-9]+|[0-9]*\.[0-9]{2})$/));
    const errorMessage = useSignal("");
    const memberIds = useSignal<string[]>([]);
    const canEdit = useComputed<boolean>(() => !!(name.value && !isProcessing.value && isCostValid.value));

    const hasInteractedWithName = useSignal(false);
    const hasInteractedWithCost = useSignal(false);

    // when trip to edit passed in changes, overlay should become visible
    useSignalEffect(() => {
        if (expenseToEdit.value) {
            console.log("edit expense overlay was opened; setting up values");

            isEditExpenseOverlayVisible.value = true;
            hasInteractedWithName.value = false;
            hasInteractedWithCost.value = false;

            // This is quite a neat/interesting syntax imo ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#binding_and_assignment )
            ({ name: name.value, description: description.value, memberIds: memberIds.value } = expenseToEdit.value);
            cost.value = `$${expenseToEdit.value.cost}`;

            errorMessage.value = "";
        }
    });

    // wipe trip to edit when overlay becomes hidden (from successful edit or closing of modal)
    useSignalEffect(() => {
        if (!isEditExpenseOverlayVisible.value) {
            expenseToEdit.value = null;
        }
    });

    const attemptEditExpense = () => {
        if (!canEdit.value) {
            console.log("Can't edit expense");
            return;
        }

        isProcessing.value = true;

        const expenseInfo: ExpensesUpdatePayload = {
            name: name.value,
            description: description.value,
            cost: parseFloat(cost.value.substring(1)),
            expenseId: expenseToEdit.value!._id,
            memberIds: memberIds.value,
        };
        request(
            "expenses/update",
            expenseInfo,
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isEditExpenseOverlayVisible.value = false;

                onSuccessfulEdit();
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    useSignalEffect(() => {
        console.log("list of selected members for expense changed to", memberIds.value);
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
        <Modal isOpen={isEditExpenseOverlayVisible}>
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
                    error={name.value || !hasInteractedWithName.value ? "" : "Must be nonempty"}
                    value={name.value}
                    onChange={(event) => {
                        name.value = event.target.value;
                        hasInteractedWithName.value = true;
                    }}
                    onEnterKey={attemptEditExpense}
                />
                <br />
                <StyledInput
                    label="Description"
                    required={false}
                    useMultiline={true}
                    // error={error}
                    value={description.value}
                    onChange={(event) => {
                        description.value = event.target.value;
                    }}
                />
                <br />
                <StyledInput
                    label="Cost"
                    error={!hasInteractedWithCost.value || isCostValid.value ? "" : "Must be a valid USD format"}
                    // onKeyDown={(event) => {
                    //     event.key
                    // }}
                    value={cost.value}
                    onChange={(event) => {
                        hasInteractedWithCost.value = true;

                        if (!event.target.value) {
                            cost.value = event.target.value;
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
                    onEnterKey={attemptEditExpense}
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
                    disabled={!canEdit.value}
                    sx={{ m: "10px" }}
                    onClick={attemptEditExpense}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
