import { useState } from "react";

import { Box, Button } from "@mui/material";

import NameInput from "./inputs/NameInput";
import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";

// TODO: make pressing enter in a field click submit button
export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signup = () => {
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
            <NameInput setName={setName} />
            <br />
            <EmailInput setEmail={setEmail} />
            <br />
            <PasswordInput setPassword={setPassword} />
            <br />
            <Button
                variant="contained"
                disabled={[name, email, password].some((value) => value === "")}
                sx={{ m: "10px" }}
                onClick={signup}
            >
                Submit
            </Button>
        </Box>
    );
}
