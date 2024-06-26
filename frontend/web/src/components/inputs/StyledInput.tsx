import { ChangeEventHandler } from "react";

import { TextField } from "@mui/material";

export default function StyledInput({ label = "", error = "", onChange }: { label: string; error: string; onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> }) {
    return (
        <TextField
            label={label}
            variant="outlined"
            margin="dense"
            error={error !== ""}
            helperText={error}
            sx={{ width: "90%" }}
            // onKeyUp={onKeyUp}
            // It seems that MUI uses onChange to mean something akin to onKeyDown instead of only triggering when focus is lost/enter is hit
            onChange={onChange}
        />
    );
}
