import { useParams } from "react-router-dom";

export default function Test() {
    const params = useParams();
    console.log(params);
    return <p>{params.jwt}</p>;
}
