import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import "./App.css";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <>
            <Navbar />
            <BrowserRouter>
                <Routes>
                    <Route key="home" path={"/"}>
                        <Home />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
