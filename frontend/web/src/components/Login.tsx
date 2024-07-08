import { useContext, useEffect, useState } from "react";

import { Box, Button } from "@mui/material";

import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { HandleValidLoginContext } from "./Navbar";

// TODO: make pressing enter in a field click submit button
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [hasValidLogin, setHasValidLogin] = useState(false);
    useEffect(() => {
        setHasValidLogin(![email, password].some((value) => value === ""));
    }, [email, password]);

    const handleValidLogin = useContext(HandleValidLoginContext);

    const attemptLogin = () => {
        if (!hasValidLogin) {
            return;
        }

        console.log(email, password);
        // TODO: impl

        handleValidLogin();
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
