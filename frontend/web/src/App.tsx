import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";
import Trips from "./pages/Trips";

export default function App() {
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path={"/home?"} element={<Home />} />
                    <Route path={"/trips"} element={<Trips />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
