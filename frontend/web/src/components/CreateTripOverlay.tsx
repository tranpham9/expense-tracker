import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { useNavigate } from "react-router-dom";
import { currentTrip } from "../Signals/Trip";
import { TripsCreatePayload } from "../utility/api/types/Payloads";

export default function CreateTripOverlay({ isCreateTripOverlayVisible }: { isCreateTripOverlayVisible: Signal<boolean> }) {
    useSignals();

    // FIXME: make name be required non-empty; the API doesn't allow it to be empty
    const isProcessing = useSignal(false);
    const name = useSignal("");
    const description = useSignal("");
    const errorMessage = useSignal("");

    const navigate = useNavigate();

    const attemptCreateTrip = () => {
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
                    // error={error}
                    onChange={(event) => {
                        name.value = event.target.value;
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
                    // disabled={!hasValidSignup || isProcessing}
                    disabled={isProcessing.value}
                    sx={{ m: "10px" }}
                    onClick={attemptCreateTrip}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
