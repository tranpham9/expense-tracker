import { ComponentProps, useState } from "react";

import StyledInput from "./StyledInput";

export default function EmailInput({ setEmail }: { setEmail: (newName: string) => void }) {
    const [error, setError] = useState("");
    const validate: ComponentProps<typeof StyledInput>["onChange"] = (event) => {
        if (event.target.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setError("Must be a valid email");
            setEmail("");
            return;
        }

        setError("");
        setEmail(event.target.value);
    };
    return (
        <StyledInput
            label="Email"
            error={error}
            onChange={validate}
        />
    );
}
