import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { TripsUpdatePayload } from "../utility/api/types/Payloads";
import { Trip } from "../utility/api/types/Responses";

export default function EditTripOverlay({ tripToEdit, onSuccessfulEdit = () => {} }: { tripToEdit: Signal<Trip | null>; onSuccessfulEdit?: () => void }) {
    useSignals();

    // can't use computed for this since the modal needs to be able to edit this signal
    // const isEditTripOverlayVisible = useComputed(() => !!tripToEdit.value);
    const isEditTripOverlayVisible = useSignal(false);

    const isProcessing = useSignal(false);

    const name = useSignal("");
    const description = useSignal("");
    const errorMessage = useSignal("");
    const canEdit = useComputed(() => name.value && !isProcessing.value);

    const hasInteractedWithName = useSignal(false);

    // when trip to edit passed in changes, overlay should become visible
    useSignalEffect(() => {
        if (tripToEdit.value) {
            console.log("edit trip overlay was opened; setting up values");

            isEditTripOverlayVisible.value = true;
            hasInteractedWithName.value = false;

            // This is quite a neat/interesting syntax imo ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#binding_and_assignment )
            ({ name: name.value, description: description.value } = tripToEdit.value);
            errorMessage.value = "";
        }
    });

    // wipe trip to edit when overlay becomes hidden (from successful edit or closing of modal)
    useSignalEffect(() => {
        if (!isEditTripOverlayVisible.value) {
            tripToEdit.value = null;
        }
    });

    // useSignalEffect(() => {
    //     if(isEditTripOverlayVisible.value) {
    //         console.log("edit trip overlay was opened; setting up values");

    //         name.value = trips.;
    //         description.value = "";
    //         errorMessage.value = "";

    //         hasInteractedWithName.value = false;
    //     }
    // });

    const attemptEditTrip = () => {
        if (!canEdit.value) {
            console.log("Can't edit trip");
            return;
        }

        isProcessing.value = true;

        const tripInfo: TripsUpdatePayload = { tripId: tripToEdit.value!._id, name: name.value, description: description.value };
        request(
            "trips/update",
            tripInfo,
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isEditTripOverlayVisible.value = false;

                onSuccessfulEdit();
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
        <Modal isOpen={isEditTripOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Edit Trip</Typography>
                <br />
                <StyledInput
                    label="Name"
                    error={name.value || !hasInteractedWithName.value ? "" : "Must be nonempty"}
                    value={name.value}
                    onChange={(event) => {
                        name.value = event.target.value;
                        hasInteractedWithName.value = true;
                    }}
                    onEnterKey={attemptEditTrip}
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
                    onClick={attemptEditTrip}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
