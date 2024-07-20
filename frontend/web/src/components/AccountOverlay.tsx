import { useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import Modal from "./Modal";
import Signup from "./Signup";
import Login from "./Login";
import { useSignals } from "@preact/signals-react/runtime";
import { Signal } from "@preact/signals-react";

export default function AccountOverlay({ isAccountOverlayVisible }: { isAccountOverlayVisible: Signal<boolean> }) {
    useSignals();

    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Modal isOpen={isAccountOverlayVisible}>
            <>
                <Box width="100%">
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab label="Login" />
                        <Tab label="Signup" />
                    </Tabs>
                </Box>
                {activeTab ? (
                    //[wrap]
                    <Signup onSuccessfulSignup={() => setActiveTab(0)} />
                ) : (
                    <Login onSuccessfulLogin={() => (isAccountOverlayVisible.value = false)} />
                )}
            </>
        </Modal>
    );
}
