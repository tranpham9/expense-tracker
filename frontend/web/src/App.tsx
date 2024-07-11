import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { AccountOverlayContextProvider, LoginContextProvider } from "./Contexts/Account";

// TODO: once logging in and JWT is set up, need to handle redirecting from trips to home if not logged in/authenticated
export default function App() {
    /*
    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);
    */

    return (
        <BrowserRouter>
            <LoginContextProvider>
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
            </LoginContextProvider>
        </BrowserRouter>
    );
}
