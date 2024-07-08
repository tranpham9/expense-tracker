import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Trips({ isLoggedIn }: { isLoggedIn: boolean }) {
    const navigate = useNavigate();

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);

    return (
        <>
            <p>This is the trips page.</p>
        </>
    );
}
