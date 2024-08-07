import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { useNavigate } from "react-router-dom";
import { currentTrip } from "../Signals/Trip";
import { TripsCreatePayload } from "../utility/api/types/Payloads";

export default function CreateTripOverlay({ isCreateTripOverlayVisible }: { isCreateTripOverlayVisible: Signal<boolean> }) {
    useSignals();

    const isProcessing = useSignal(false);

    const name = useSignal("");
    const description = useSignal("");
    const errorMessage = useSignal("");
    const canCreate = useComputed(() => name.value && !isProcessing.value);

    const hasInteractedWithName = useSignal(false);

    const navigate = useNavigate();

    const attemptCreateTrip = () => {
        if (!canCreate.value) {
            console.log("Can't create trip");
            return;
        }

        isProcessing.value = true;

        const tripInfo: TripsCreatePayload = { name: name.value, description: description.value };
        request(
            "trips/create",
            tripInfo,
            (response) => {
                console.log(response);

                isProcessing.value = false;
                currentTrip.value = response.trip;

                navigate("/expenses");
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    useSignalEffect(() => {
        if (!isCreateTripOverlayVisible.value) {
            console.log("create trip overlay was closed; resetting all values");

            // reset all values (with the way that the StyledInputs work, they are one-way with information; their values changing updates these signals but not the other way around; accordingly, these all need to get wiped)
            name.value = "";
            description.value = "";
            errorMessage.value = "";

            hasInteractedWithName.value = false;
        }
    });

    return (
        <Modal isOpen={isCreateTripOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Create Trip</Typography>
                <br />
                <StyledInput
                    label="Name"
                    error={name.value || !hasInteractedWithName.value ? "" : "Must be nonempty"}
                    onChange={(event) => {
                        name.value = event.target.value;
                        hasInteractedWithName.value = true;
                    }}
                    onEnterKey={attemptCreateTrip}
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
                    onClick={attemptCreateTrip}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
