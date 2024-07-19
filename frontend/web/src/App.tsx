import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";
import Expenses from "./pages/Expenses";

import "./App.css";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { theme } from "./Theme";
import Test from "./components/Test";

export default function App() {
    /*
    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);
    */

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
                    {/* TODO: properly impl */}
                    <Route
                        path={"/reset/:jwt"}
                        element={<Test />}
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
