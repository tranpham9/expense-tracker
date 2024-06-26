import { ComponentProps, useState } from "react";

import StyledInput from "./StyledInput";

export default function NameInput({ setName }: { setName: (newName: string) => void }) {
    const [error, setError] = useState("");
    const validate: ComponentProps<typeof StyledInput>["onChange"] = (event) => {
        if (event.target.value.length < 4) {
            setError("Must be at least 4 characters long");
            setName("");
            return;
        }

        if (event.target.value.match(/[^A-Za-z ]/)) {
            setError("Can only have letters and spaces");
            setName("");
            return;
        }

        setError("");
        setName(event.target.value);
    };
    return (
        <StyledInput
            label="Name"
            error={error}
            onChange={validate}
        />
    );
}
