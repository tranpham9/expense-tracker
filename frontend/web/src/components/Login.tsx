import { useContext, useState } from "react";

import { Box, Button } from "@mui/material";

import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { HandleValidLoginContext } from "./Navbar";

// TODO: make pressing enter in a field click submit button
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleValidLogin = useContext(HandleValidLoginContext);

    const login = () => {
        console.log(email, password);
        // TODO: impl

        // TODO: temp
        handleValidLogin();
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
            <PasswordInput setPassword={setPassword} />
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
