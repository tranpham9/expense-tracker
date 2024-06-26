import { Box, Button, TextField } from "@mui/material";

export default function Signup() {
    return (
        <Box
            sx={{
                textAlign: "center",
                pt: "10px",
            }}
        >
            <TextField
                variant="outlined"
                label="Name"
                sx={{ width: "90%" }}
                margin="dense"
            />
            <br />
            <TextField
                variant="outlined"
                label="Email"
                sx={{ width: "90%" }}
                margin="dense"
            />
            <br />
            <TextField
                variant="outlined"
                label="Password"
                sx={{ width: "90%" }}
                margin="dense"
            />
            <br />
            <Button
                variant="contained"
                sx={{ m: "10px" }}
            >
                Submit
            </Button>
        </Box>
    );
}
