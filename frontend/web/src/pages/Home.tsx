import { useState } from "react";

import { Box, Container, Tab, Tabs, TextField, Typography } from "@mui/material";

import Modal from "../components/Modal";

export default function Home() {
    let [isModalOpen, setIsModalOpen] = useState(true);
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <p>This is the home page.</p>
            <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
                <>
                    <Box sx={{ width: '100%' }}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab label="Login" />
                            <Tab label="Signup" />
                        </Tabs>
                    </Box>
                    <Box sx={{
                        textAlign: "center",
                        pt: "10px",
                    }}>
                        <TextField variant="outlined" label="email" sx={{
                            width: "80%",
                            p: "5px",
                        }} />
                        <br />
                        <TextField variant="outlined" label="password" sx={{
                            width: "80%",
                            p: "5px",
                        }} />
                    </Box>
                </>
            </Modal>
        </>
    );
}
