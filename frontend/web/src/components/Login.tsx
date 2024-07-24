import { useEffect, useState } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { useNavigate } from "react-router-dom";
import { request } from "../utility/api/API";
import md5 from "md5";
import { userInfo } from "../Signals/Account";
import { useSignal, useSignals } from "@preact/signals-react/runtime";
import ForgotPasswordOverlay from "./ForgotPasswordOverlay";

// TODO: make pressing enter in a field click submit button
export default function Login({ onSuccessfulLogin = () => {} }) {
    useSignals();

    const isProcessing = useSignal(false);
    const errorMessage = useSignal("");

    const isForgotPasswordOverlayVisible = useSignal(false);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasValidLogin, setHasValidLogin] = useState(false);
    useEffect(() => {
        setHasValidLogin(![email, password].some((value) => value === ""));
    }, [email, password]);

    const attemptLogin = () => {
        if (!hasValidLogin) {
            console.log("Can't login");
            return;
        }

        console.log(email, password);

        isProcessing.value = true;

        request(
            "users/login",
            { email, password: md5(password) },
            (response) => {
                console.log(response);

                isProcessing.value = false;
                userInfo.value = response;

                onSuccessfulLogin();

                if (response.jwt) {
                    navigate("/trips");
                }
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
        <>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <EmailInput
                    setEmail={setEmail}
                    onEnterKey={attemptLogin}
                />
                <br />
                <PasswordInput
                    setPassword={setPassword}
                    onEnterKey={attemptLogin}
                />
                <br />
                <Button
                    variant="text"
                    // onClick={handleForgotPassword}
                    onClick={() => {
                        isForgotPasswordOverlayVisible.value = true;
                    }}
                    color="info"
                    size="large"
                    sx={{
                        m: 1,
                        fontWeight: "bold",
                    }}
                >
                    {/* when bold, the t makes it look like the spacing to the left and right of it is the same, so I added an extra space (via a non-breaking space) */}
                    Forgot &nbsp;Password
                </Button>
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
                    disabled={!hasValidLogin || isProcessing.value}
                    sx={{ m: "10px" }}
                    onClick={attemptLogin}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
            <ForgotPasswordOverlay isForgotPasswordOverlayVisible={isForgotPasswordOverlayVisible} />
        </>
    );
}
