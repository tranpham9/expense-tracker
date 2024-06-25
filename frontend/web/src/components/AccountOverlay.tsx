import { useState } from "react";

import { Box, Tab, Tabs, TextField } from "@mui/material";

import Modal from "./Modal";
import Signup from "./Signup";
import Login from "./Login";

export default function AccountOverlay() {
    const [isModalOpen, setIsModalOpen] = useState(true);

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen}>
            <>
                <Box sx={{ width: '100%' }}>
                    <Tabs value={activeTab} onChange={handleTabChange} centered>
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>
                </Box>
                <Box sx={{
                    textAlign: "center",
                    pt: "10px",
                }}>
                    {activeTab ? <Signup /> : <Login />}
                </Box>
            </>
        </Modal>
    );
}
