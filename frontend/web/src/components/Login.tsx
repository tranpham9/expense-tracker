import { useState } from "react";

import { Box, Button, TextField } from "@mui/material";

import EmailInput from "./inputs/EmailInput";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        console.log(email, password);
        // TODO: impl
    };

    return (
        <Box
            sx={{
                textAlign: "center",
                pt: "10px",
            }}
        >
            <EmailInput setEmail={setEmail} />
            <br />
            <TextField
                variant="outlined"
                label="Password"
                sx={{ width: "90%" }}
                margin="dense"
            />
            <br />
            <Button
                variant="contained"
                disabled={[email, password].some((value) => value === "")}
                sx={{ m: "10px" }}
                onClick={login}
            >
                Submit
            </Button>
        </Box>
    );
}
