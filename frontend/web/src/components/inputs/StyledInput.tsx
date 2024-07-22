import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

import { TextField } from "@mui/material";

export default function StyledInput({
    type = "text",
    label = "",
    error = "",
    required = true,
    useMultiline = false,
    // These have no default values on purpose!
    onChange,
    onEnterKey,
}: // onKeyDown = () => {},
{
    type?: HTMLInputTypeAttribute;
    label?: string;
    error?: string;
    required?: boolean;
    useMultiline?: boolean;
    onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onEnterKey?: () => void;
    // onKeyDown?: KeyboardEventHandler<HTMLDivElement>; // excludes enter key
}) {
    return (
        <TextField
            type={type}
            label={label}
            variant="outlined"
            multiline={useMultiline}
            rows={3}
            margin="dense"
            required={required}
            error={error !== ""}
            helperText={error}
            // This only shows when there is no error
            // FIXME: this also shows right at the start, which isn't desired
            // color="success"
            sx={{ width: "90%" }}
            onKeyDown={(event) => {
                if (onEnterKey && event.key === "Enter") {
                    event.preventDefault();
                    onEnterKey();
                } /*else {
                    onKeyDown(event);
                }*/
            }}
            // onKeyUp={onKeyUp}
            // It seems that MUI uses onChange to mean something akin to onKeyDown instead of only triggering when focus is lost/enter is hit
            onChange={(event) => {
                onChange?.(event);
            }}
        />
    );
}
