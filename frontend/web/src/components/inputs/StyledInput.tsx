import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

import { TextField } from "@mui/material";

export default function StyledInput({
    type = "text",
    label = "",
    error = "",
    required = true,
    onChange,
}: {
    type?: HTMLInputTypeAttribute;
    label?: string;
    error?: string;
    required?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}) {
    return (
        <TextField
            type={type}
            label={label}
            variant="outlined"
            margin="dense"
            required={required}
            error={error !== ""}
            helperText={error}
            // This only shows when there is no error
            // FIXME: this also shows right at the start, which isn't desired
            // color="success"
            sx={{ width: "90%" }}
            // onKeyUp={onKeyUp}
            // It seems that MUI uses onChange to mean something akin to onKeyDown instead of only triggering when focus is lost/enter is hit
            onChange={onChange}
        />
    );
}
