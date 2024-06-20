import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

export default function App() {
    return (
        <>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route path={"/"}>
                        <Home />
                    </Route>
                    <Route path={"/trips"}>
                        <Trips />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
