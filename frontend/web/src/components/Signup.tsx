import { Button, TextField } from "@mui/material";

export default function Signup() {
    return (
        <>
            <TextField variant="outlined" label="Name" sx={{
                width: "80%",
                p: "5px",
            }} />
            <br />
            <TextField variant="outlined" label="Email" sx={{
                width: "80%",
                p: "5px",
            }} />
            <br />
            <TextField variant="outlined" label="Password" sx={{
                width: "80%",
                p: "5px",
            }} />
            <br />
            <Button variant="contained" sx={{ m: "10px" }}>
                Submit
            </Button>
        </>
    );
}
