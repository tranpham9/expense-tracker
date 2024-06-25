import { type ReactElement } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

export default function TransitionModal({ isOpen, setIsOpen, shouldCloseOnLostFocus = false, children }: { isOpen: boolean, setIsOpen: (newValue: boolean) => void, shouldCloseOnLostFocus?: boolean, children: ReactElement }) {
    const close = () => {
        setIsOpen(false);
    };

    const handleClose = () => {
        if (shouldCloseOnLostFocus)
            close();
    };

    return (
        <div>
            <Modal
                open={isOpen}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen}>
                    <Box sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "80%",
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <IconButton aria-label="close" onClick={close} color="primary" sx={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                        }}>
                            <CloseIcon />
                        </IconButton>
                        {children}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
