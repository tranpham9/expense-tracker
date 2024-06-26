import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { useState } from "react";

// TODO: once logging in and JWT is set up, need to handle redirecting from trips to home if not logged in/authenticated
export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <>
            <BrowserRouter>
                <Navbar isLoggedIn={isLoggedIn} />
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
            </BrowserRouter>
        </>
    );
}
