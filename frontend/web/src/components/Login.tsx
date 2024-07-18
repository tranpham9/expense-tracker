import { useContext, useEffect, useState } from "react";

import { Box, Button } from "@mui/material";

import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./inputs/PasswordInput";
import { useNavigate } from "react-router-dom";
import { request } from "../utility/api/API";
import { AccountContext, AccountOverlayContext, LoginContext } from "../Contexts/Account";
import { saveAccountInfo } from "../utility/Persist";
import md5 from "md5";

// TODO: make pressing enter in a field click submit button
export default function Login() {
    const navigate = useNavigate();

    const { setIsAccountOverlayVisible } = useContext(AccountOverlayContext);
    const { setAccount } = useContext(AccountContext);

    const { setIsLoggedIn } = useContext(LoginContext);

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
            "login",
            { email, password: md5(password) },
            (response) => {
                console.log(response);
                setAccount(response);
                saveAccountInfo(response);

                setIsLoggedIn(true);
                setIsAccountOverlayVisible(false);

                navigate("/trips");
            },
            (errorMessage) => {
                console.log(errorMessage);
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
