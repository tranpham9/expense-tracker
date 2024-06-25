import { Button, TextField } from "@mui/material";

export default function Login() {
    return (
        <>
            <TextField variant="outlined" label="Email" sx={{
                width: "90%",
                p: "5px",
            }} />
            <br />
            <TextField variant="outlined" label="Password" sx={{
                width: "90%",
                p: "5px",
            }} />
            <br />
            <Button variant="contained" sx={{ m: "10px" }}>
                Submit
            </Button>
        </>
    );
}

