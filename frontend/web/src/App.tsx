import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { createContext, useEffect, useState } from "react";

export const LoginContext = createContext<{ isLoggedIn: boolean; setIsLoggedIn: (isLoggedIn: boolean) => void }>({ isLoggedIn: false, setIsLoggedIn: () => {} });

// TODO: once logging in and JWT is set up, need to handle redirecting from trips to home if not logged in/authenticated
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);

    return (
        <BrowserRouter>
            <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
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
                </Routes>
            </LoginContext.Provider>
        </BrowserRouter>
    );
}
