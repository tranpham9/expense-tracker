import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { AccountContextProvider, AccountOverlayContextProvider, LoginContextProvider } from "./Contexts/Account";
import { ThemeProvider } from "@emotion/react";
import { alpha, createTheme, CssBaseline } from "@mui/material";
import { blue, common, grey, orange } from "@mui/material/colors";

export default function App() {
    /*
    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);
    */

    const theme = createTheme({
        palette: {
            mode: "dark",
            primary: {
                main: blue[700],
            },
            secondary: {
                main: orange[500],
            },
            background: {
                // default: grey[800],
                default: grey[900],
            },
            text: {
                primary: common["white"],
                // secondary: grey[300],
                secondary: grey[400],
            },
        },
        components: {
            MuiDivider: {
                styleOverrides: {
                    root: {
                        // backgroundColor: alpha(orange[500], 0.8),
                        borderColor: alpha(orange[500], 0.6),
                    },
                },
            },
            // MuiModal: {
            //     styleOverrides: {
            //         root: {
            //             backgroundColor: grey[900],
            //         },
            //     },
            // },
            MuiAvatar: {
                styleOverrides: {
                    colorDefault: {
                        // bgcolor: "primary.main",
                        // color: "text.primary",
                        backgroundColor: blue[700],
                        color: common["white"],
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <LoginContextProvider>
                    <AccountContextProvider>
                        <AccountOverlayContextProvider>
                            <Navbar />
                        </AccountOverlayContextProvider>
                        <Routes>
                            <Route
                                path={"/home?"}
                                element={<Home />}
                            />
                            <Route
                                path={"/trips"}
                                element={<Trips />}
                            />
                        </Routes>
                    </AccountContextProvider>
                </LoginContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}
