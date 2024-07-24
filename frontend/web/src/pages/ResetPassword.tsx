import { useSignal, useSignals } from "@preact/signals-react/runtime";
import { useParams } from "react-router-dom";
import ResetPasswordOverlay from "../components/ResetPasswordOverlay";

export default function ResetPassword() {
    useSignals();

    const isResetPasswordOverlayVisible = useSignal(true);

    const { jwt } = useParams();

    return (
        <ResetPasswordOverlay
            isResetPasswordOverlayVisible={isResetPasswordOverlayVisible}
            jwt={jwt || ""}
        />
    );
}
