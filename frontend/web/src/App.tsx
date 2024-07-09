import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { createContext, useEffect, useState } from "react";

export const TriggerLoginContext = createContext(() => {});

// TODO: once logging in and JWT is set up, need to handle redirecting from trips to home if not logged in/authenticated
export default function App() {
    // TODO: this should default to false once logging in is set up
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);

    return (
        <BrowserRouter>
            <TriggerLoginContext.Provider value={() => setIsLoggedIn(true)}>
                <Navbar
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                />
            </TriggerLoginContext.Provider>
            <Routes>
                <Route
                    path={"/home?"}
                    element={<Home />}
                />
                <Route
                    path={"/trips"}
                    element={<Trips isLoggedIn={isLoggedIn} />}
                />
            </Routes>
        </BrowserRouter>
    );
}
