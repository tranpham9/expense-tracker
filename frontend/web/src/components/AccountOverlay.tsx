import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import Modal from "./Modal";
import Signup from "./Signup";
import Login from "./Login";

export default function AccountOverlay({ shouldShow, setShouldShow }: { shouldShow: boolean; setShouldShow: (newValue: boolean) => void }) {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Modal
            isOpen={shouldShow}
            setIsOpen={setShouldShow}
        >
            <>
                <Box sx={{ width: "100%" }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>
                </Box>
                {activeTab ? <Signup /> : <Login />}
            </>
        </Modal>
    );
}
