import { Box, Button, TextField } from "@mui/material";

export default function Login() {
    return (
        <Box
            sx={{
                textAlign: "center",
                pt: "10px",
            }}
        >
            <TextField
                variant="outlined"
                label="Email"
                sx={{
                    width: "90%",
                    p: "5px",
                }}
            />
            <br />
            <TextField
                variant="outlined"
                label="Password"
                sx={{
                    width: "90%",
                    p: "5px",
                }}
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
