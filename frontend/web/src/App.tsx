import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

import "./App.css";
import { AccountContextProvider, AccountOverlayContextProvider, LoginContextProvider } from "./Contexts/Account";

export default function App() {
    /*
    useEffect(() => {
        // TODO: store/load relevant JWT
    }, [isLoggedIn]);
    */

    return (
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
    );
}
