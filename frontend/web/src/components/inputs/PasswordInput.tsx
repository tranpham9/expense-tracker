import { ComponentProps, useState } from "react";

import StyledInput from "./StyledInput";

export default function PasswordInput({ setPassword }: { setPassword: (newName: string) => void }) {
    const [error, setError] = useState("");
    const validate: ComponentProps<typeof StyledInput>["onChange"] = (event) => {
        if (event.target.value.length < 8) {
            setError("Must be at least 8 characters long");
            setPassword("");
            return;
        }

        if (!event.target.value.match(/[A-Z]/)) {
            setError("Must have an uppercase letter");
            setPassword("");
            return;
        }

        if (!event.target.value.match(/[a-z]/)) {
            setError("Must have a lowercase letter");
            setPassword("");
            return;
        }

        if (!event.target.value.match(/[0-9]/)) {
            setError("Must have a digit");
            setPassword("");
            return;
        }

        if (!event.target.value.match(/[^A-Za-z0-9]/)) {
            setError("Must have a special character");
            setPassword("");
            return;
        }

        setError("");
        setPassword(event.target.value);
    };

    return (
        <StyledInput
            type="password"
            label="Password"
            error={error}
            onChange={validate}
        />
    );
}
