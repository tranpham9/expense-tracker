import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";

export default function CreateTripOverlay({ isCreateTripOverlayVisible }: { isCreateTripOverlayVisible: Signal<boolean> }) {
    useSignals();

    const isProcessing = useSignal(false);
    const name = useSignal("");
    const description = useSignal("");
    const errorMessage = useSignal("");

    const attemptCreateTrip = () => {
        request(
            "trips/create",
            { name: name.value, description: description.value },
            (response) => {
                console.log(response);
                // TODO: set a persistent signal which stores the current trip id (which expenses tab will reference whenever loaded, and this will determine whether the expenses tab is enabled or not)
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    // TODO: maybe require name non-empty?
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
                    // error={error}
                    onChange={(event) => {
                        description.value = event.target.value;
                    }}
                    onEnterKey={attemptCreateTrip}
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
