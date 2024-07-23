import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { request } from "../utility/api/API";

export default function JoinTripOverlay({ isJoinTripOverlayVisible, onSuccessfulJoin = () => {} }: { isJoinTripOverlayVisible: Signal<boolean>; onSuccessfulJoin?: () => void }) {
    useSignals();

    // FIXME: make name be required non-empty; the API doesn't allow it to be empty
    // NOTE: there is no need to wipe these since creating a trip redirects to expenses page (which completely removes these variables from existence)
    const isProcessing = useSignal(false);

    const inviteCode = useSignal("");
    const canJoin = useComputed(() => !isProcessing.value && !!inviteCode.value.match(/^[0-9]{6}$/));
    const errorMessage = useSignal("");

    const hasInteractedWithInviteCode = useSignal(false);

    const attemptJoinTrip = () => {
        if (!canJoin.value) {
            console.log("Can't join trip");
            return;
        }

        isProcessing.value = true;

        request(
            "trips/join",
            { inviteCode: inviteCode.value },
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isJoinTripOverlayVisible.value = false;

                onSuccessfulJoin();
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    useSignalEffect(() => {
        if (!isJoinTripOverlayVisible.value) {
            console.log("join trip overlay was closed; resetting all values");

            // reset all values (with the way that the StyledInputs work, they are one-way with information; their values changing updates these signals but not the other way around; accordingly, these all need to get wiped)
            inviteCode.value = "";
            errorMessage.value = "";

            hasInteractedWithInviteCode.value = false;
        }
    });

    return (
        <Modal isOpen={isJoinTripOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Join Trip</Typography>
                <br />
                <StyledInput
                    label="Invite Code"
                    error={!hasInteractedWithInviteCode.value || inviteCode.value ? "" : "Must be a six-digit number"}
                    // onKeyDown={(event) => {
                    //     event.key
                    // }}
                    onChange={(event) => {
                        hasInteractedWithInviteCode.value = true;

                        if (!event.target.value) {
                            inviteCode.value = event.target.value;
                            return;
                        }

                        // if(event.target.value.match(/[^0-9.$]/)) {
                        //     event.target.value = cost.value;
                        // }

                        if (event.target.value.match(/^[0-9]{0,6}$/)) {
                            inviteCode.value = event.target.value;
                        } else {
                            event.target.value = inviteCode.value;
                        }
                    }}
                    onEnterKey={attemptJoinTrip}
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
                    disabled={!canJoin.value}
                    sx={{ m: "10px" }}
                    onClick={attemptJoinTrip}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
