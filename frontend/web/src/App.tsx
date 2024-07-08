import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { useEffect, useState } from "react";

// TODO: once logging in and JWT is set up, need to handle redirecting from trips to home if not logged in/authenticated
export default function App() {
    // TODO: this should default to false once logging in is set up
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // TODO: store/load relevant JWT
    });

    return (
        <BrowserRouter>
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
            />
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
