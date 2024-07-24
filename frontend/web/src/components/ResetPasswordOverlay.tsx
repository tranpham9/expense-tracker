import { Box, Button, CircularProgress, Typography } from "@mui/material";

import Modal from "./Modal";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import { Signal } from "@preact/signals-react";
import { useState } from "react";
import { request } from "../utility/api/API";
import PasswordInput from "./inputs/PasswordInput";
import { useNavigate } from "react-router-dom";
import md5 from "md5";

export default function ResetPasswordOverlay({ isResetPasswordOverlayVisible, jwt }: { isResetPasswordOverlayVisible: Signal<boolean>; jwt: string }) {
    useSignals();

    const isProcessing = useSignal(false);
    const errorMessage = useSignal("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const attemptResetPassword = () => {
        if (!password) {
            console.log("Can't reset password");
            return;
        }

        isProcessing.value = true;

        request(
            "users/resetPassword",
            { jwt, newPassword: md5(password) },
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isResetPasswordOverlayVisible.value = false;

                navigate("/home");
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
        <Modal isOpen={isResetPasswordOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h5">Reset Password</Typography>
                <br />
                <PasswordInput
                    setPassword={setPassword}
                    onEnterKey={attemptResetPassword}
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
                    disabled={!password || isProcessing.value}
                    sx={{ m: "10px" }}
                    onClick={attemptResetPassword}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
