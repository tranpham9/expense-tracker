import { useSignals } from "@preact/signals-react/runtime";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
    useSignals();

    const params = useParams();
    console.log(params);

    return <p>{params.jwt}</p>;
}
