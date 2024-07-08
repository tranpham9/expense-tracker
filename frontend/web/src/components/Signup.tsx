import { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";

import NameInput from "./inputs/NameInput";
import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";

// TODO: make pressing enter in a field click submit button
export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasValidSignup, setHasValidSignup] = useState(false);
    useEffect(() => {
        setHasValidSignup(![name, email, password].some((value) => value === ""));
    }, [name, email, password]);

    const attemptSignup = () => {
        if (!hasValidSignup) {
            return;
        }

        console.log(name, email, password);
        // TODO: impl
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
            <Button
                variant="contained"
                disabled={!hasValidSignup}
                sx={{ m: "10px" }}
                onClick={attemptSignup}
            >
                Submit
            </Button>
        </Box>
    );
}
