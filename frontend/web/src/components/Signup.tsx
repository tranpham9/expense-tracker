import { useState } from "react";

import { Box, Button, TextField } from "@mui/material";

import NameInput from "./inputs/NameInput";

// TODO: need to make the submit button be disabled if not all fields are valid (it should start disabled since fields don't start as red until the user starts typing in them)
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
            <TextField
                variant="outlined"
                label="Email"
                sx={{ width: "90%" }}
                margin="dense"
            />
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
                sx={{ m: "10px" }}
                onClick={signup}
            >
                Submit
            </Button>
        </Box>
    );
}
