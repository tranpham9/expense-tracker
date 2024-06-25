import { useState } from "react";

import { Container, TextField, Typography } from "@mui/material";

import Modal from "../components/Modal";

export default function Home() {
    let [isModalOpen, setIsModalOpen] = useState(true);
    return (
        <>
            <p>This is the home page.</p>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                <>
                    <Typography variant="h3" component="h1" sx={{ textAlign: "center" }}>
                        Login
                    </Typography>
                    <Container sx={{
                        width: "100%",
                        textAlign: "center",
                        mt: "10px",
                    }}>
                        <TextField variant="outlined" label="email" sx={{
                            width: "80%",
                            margin: "5px",
                        }} />
                        <br />
                        <TextField variant="outlined" label="password" sx={{
                            width: "80%",
                            margin: "5px",
                        }} />
                    </Container>
                </>
            </Modal>
        </>
    );
}
