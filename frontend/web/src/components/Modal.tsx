import { type ReactElement } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import { useSignals } from "@preact/signals-react/runtime";
import { Signal } from "@preact/signals-react";

export default function TransitionModal({
    isOpen,
    shouldCloseOnLostFocus = false,
    children,
}: {
    isOpen: Signal<boolean>;
    shouldCloseOnLostFocus?: boolean;
    children: ReactElement;
}) {
    useSignals();

    const close = () => {
        isOpen.value = false;
    };

    const handleClose = () => {
        if (shouldCloseOnLostFocus) {
            close();
        }
    };

    return (
        <div>
            <Modal
                open={isOpen.value}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen.value}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: { xs: "60%", sm: "400px" },
                            bgcolor: "background.paper",
                            border: "1px solid",
                            // TODO: figure out which one fits more
                            borderColor: "secondary.main",
                            // borderColor: "primary.main",
                            boxShadow: "0px 0px 10px 10px #0001",
                            p: 4,
                            ":focus": {
                                // disables outline when modal first takes/traps focus
                                outline: "none",
                            },
                        }}
                    >
                        <IconButton
                            aria-label="close"
                            onClick={close}
                            color="primary"
                            sx={{
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        {children}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
