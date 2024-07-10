import { Divider } from "@mui/material";
import AboutUs from "../components/AboutUs";
import Welcome from "../components/Welcome";

export default function Home() {
    return (
        <>
            <Welcome />
            <Divider />
            <AboutUs />
        </>
    );
}
