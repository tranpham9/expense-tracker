import { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { useNavigate } from "react-router-dom";
import { request } from "../utility/api/API";
import md5 from "md5";
import { userInfo, userJWT } from "../Signals/Account";
import { useSignal, useSignals } from "@preact/signals-react/runtime";

// TODO: make pressing enter in a field click submit button
export default function Login() {
    useSignals();

    const errorMessage = useSignal("");

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasValidLogin, setHasValidLogin] = useState(false);
    useEffect(() => {
        setHasValidLogin(![email, password].some((value) => value === ""));
    }, [email, password]);

    const attemptLogin = () => {
        if (!hasValidLogin) {
            return;
        }

        console.log(email, password);

        request(
            "users/login",
            { email, password: md5(password) },
            (response) => {
                console.log(response);
                userInfo.value = response;
                userJWT.value = response.jwt;

                if (response.jwt) {
                    navigate("/trips");
                }
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
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
            {errorMessage.value && (
                <Typography
                    variant="body1"
                    mt={1}
                    color="error.main"
                >
                    {errorMessage.value}
                </Typography>
            )}
            <Button
                variant="contained"
                disabled={!hasValidLogin}
                sx={{ m: "10px" }}
                onClick={attemptLogin}
            >
                Submit
            </Button>
        </Box>
    );
}
