import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";
import Expenses from "./pages/Expenses";

import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { theme } from "./Theme";
import { useEffect } from "react";
import { request } from "./utility/api/API";
import { userJWT } from "./Signals/Account";
import { useSignals } from "@preact/signals-react/runtime";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";

export default function App() {
    useSignals();

    // run on startup to ensure use should still be logged in
    useEffect(() => {
        if (userJWT.value) {
            request(
                "refreshJWT",
                {},
                () => console.log("User loaded in with a valid session; refreshed JWT."),
                () => console.log("User loaded in with an expired session; logging out.")
            );
        }
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route
                        path={"/home?"}
                        element={<Home />}
                    />
                    <Route
                        path={"/trips"}
                        element={<Trips />}
                    />
                    <Route
                        path={"/expenses"}
                        element={<Expenses />}
                    />
                    <Route
                        path={"/resetPassword/:jwt"}
                        element={<ResetPassword />}
                    />
                    <Route
                        path={"/profile/:userId"}
                        // path={"/profile/:name/:email/:bio"}
                        element={<Profile />}
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
