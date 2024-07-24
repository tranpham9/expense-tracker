import { Box, Button, CircularProgress, Typography } from "@mui/material";

import Modal from "./Modal";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { Signal } from "@preact/signals-react";
import EmailInput from "./inputs/EmailInput";
import { useState } from "react";
import { request } from "../utility/api/API";

export default function ForgotPasswordOverlay({ isForgotPasswordOverlayVisible }: { isForgotPasswordOverlayVisible: Signal<boolean> }) {
    useSignals();

    const isProcessing = useSignal(false);
    const errorMessage = useSignal("");

    const [email, setEmail] = useState("");

    // reset email field to be invalid when closing
    useSignalEffect(() => {
        if (!isForgotPasswordOverlayVisible.value) {
            setEmail("");
        }
    });

    const attemptRequestResetPassword = () => {
        if (!email) {
            console.log("Can't request reset password");
            return;
        }

        isProcessing.value = true;

        request(
            "users/forgotPassword",
            { email },
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isForgotPasswordOverlayVisible.value = false;
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
        <Modal isOpen={isForgotPasswordOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Forgot Password</Typography>
                <br />
                <EmailInput
                    setEmail={setEmail}
                    onEnterKey={attemptRequestResetPassword}
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
                    disabled={!email}
                    sx={{ m: "10px" }}
                    onClick={attemptRequestResetPassword}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
