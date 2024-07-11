import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Contexts/Account";

export default function Trips() {
    const navigate = useNavigate();

    const { isLoggedIn } = useContext(LoginContext);

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    useEffect(() => {
        if (!isLoggedIn) {
            console.log("<not logged in>");
            navigate("/home");
        }
    }, [isLoggedIn, navigate]); // always trigger when navigating to here (navigate changes when path changes)

    return (
        <>
            <p>This is the trips page.</p>
        </>
    );
}
