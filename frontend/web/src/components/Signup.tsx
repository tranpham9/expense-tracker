import { useEffect, useState } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import NameInput from "./inputs/NameInput";
import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { request } from "../utility/api/API";

export default function Signup({ onSuccessfulSignup = () => {} }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasValidSignup, setHasValidSignup] = useState(false);
    useEffect(() => {
        setHasValidSignup(![name, email, password].some((value) => value === ""));
    }, [name, email, password]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const attemptSignup = () => {
        if (!hasValidSignup) {
            return;
        }

        console.log(name, email, password);

        setIsProcessing(true);

        request(
            "registerUser",
            { name, email, password },
            (response) => {
                console.log(response.message);
                setIsProcessing(false);

                onSuccessfulSignup();
            },
            (errorMessage) => {
                console.log(errorMessage);
                setIsProcessing(false);

                // FIXME: the api needs to give a bit better of an error than just "ERROR"
                // setErrorMessage(errorMessage);
                setErrorMessage("Unable to Create Account");
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
            <NameInput
                setName={setName}
                onEnterKey={attemptSignup}
            />
            <br />
            <EmailInput
                setEmail={setEmail}
                onEnterKey={attemptSignup}
            />
            <br />
            <PasswordInput
                setPassword={setPassword}
                onEnterKey={attemptSignup}
            />
            <br />
            {errorMessage && (
                <Typography
                    variant="body1"
                    mt={1}
                    color="error.main"
                >
                    {errorMessage}
                </Typography>
            )}
            <Button
                variant="contained"
                disabled={!hasValidSignup || isProcessing}
                sx={{ m: "10px" }}
                onClick={attemptSignup}
            >
                {isProcessing ? <CircularProgress size={24} /> : "Submit"}
            </Button>
        </Box>
    );
}
