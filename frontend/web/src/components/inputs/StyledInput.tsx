import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

import { TextField } from "@mui/material";

export default function StyledInput({
    type = "text",
    label = "",
    error = "",
    value,
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
    // NOTE: this should only really be used for when state needs to flow into it as well (kind of like a two-way binding; this is called "controlled" in react + MUI:
    //     https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
    //     https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
    // )
    value?: string;
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
            minRows={3}
            margin="dense"
            required={required}
            error={error !== ""}
            helperText={error}
            value={value}
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
