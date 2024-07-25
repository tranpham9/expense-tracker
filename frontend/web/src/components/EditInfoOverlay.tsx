import { Signal } from "@preact/signals-react";
import Modal from "./Modal";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import StyledInput from "./inputs/StyledInput";
import { Box, Button, CircularProgress, Divider, Typography } from "@mui/material";
import { request } from "../utility/api/API";
import { userInfo } from "../Signals/Account";

export default function EditInfoOverlay({ isEditInfoOverlayVisible }: { isEditInfoOverlayVisible: Signal<boolean> }) {
    useSignals();

    const isProcessing = useSignal(false);

    const name = useSignal("");
    const bio = useSignal("");
    const errorMessage = useSignal("");
    const canEdit = useComputed(() => !!(name.value && !isProcessing.value));

    const hasInteractedWithName = useSignal(false);
    const hasInteractedWithBio = useSignal(false);

    useSignalEffect(() => {
        // user info should have a value at this point, but checking just in case
        if (isEditInfoOverlayVisible.value && userInfo.value) {
            console.log("edit info overlay was opened; setting up values");

            hasInteractedWithName.value = false;
            hasInteractedWithBio.value = false;

            // This is quite a neat/interesting syntax imo ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#binding_and_assignment )
            ({ name: name.value, bio: bio.value } = userInfo.value);

            errorMessage.value = "";
        }
    });

    const attemptEditInfo = () => {
        if (!canEdit.value) {
            console.log("Can't edit trip");
            return;
        }

        isProcessing.value = true;

        request(
            "users/update",
            { name: name.value, bio: bio.value },
            (response) => {
                console.log(response);

                isProcessing.value = false;
                isEditInfoOverlayVisible.value = false;

                // onSuccessfulEdit();

                // this is another fun/interesting syntax
                userInfo.value &&= { ...userInfo.value, name: name.value, bio: bio.value };
            },
            (currentErrorMessage) => {
                console.log(currentErrorMessage);

                isProcessing.value = false;
                errorMessage.value = currentErrorMessage;
            }
        );
    };

    return (
        <Modal isOpen={isEditInfoOverlayVisible}>
            <Box
                sx={{
                    textAlign: "center",
                    pt: "10px",
                }}
            >
                <Typography variant="h4">Settings</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h5">Edit Info</Typography>
                <br />
                <StyledInput
                    label="Name"
                    error={name.value || !hasInteractedWithName.value ? "" : "Must be nonempty"}
                    value={name.value}
                    onChange={(event) => {
                        name.value = event.target.value;
                        hasInteractedWithName.value = true;
                    }}
                    onEnterKey={attemptEditInfo}
                />
                <br />
                <StyledInput
                    label="Bio"
                    required={false}
                    useMultiline={true}
                    value={bio.value}
                    onChange={(event) => {
                        bio.value = event.target.value;
                    }}
                />
                <br />
                {errorMessage.value && (
                    <Typography
                        variant="body1"
                        mt={0}
                        mb={1}
                        color="error.main"
                    >
                        {errorMessage.value}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    disabled={!canEdit.value}
                    sx={{ m: "10px" }}
                    onClick={attemptEditInfo}
                >
                    {isProcessing.value ? <CircularProgress size={24} /> : "Submit"}
                </Button>
            </Box>
        </Modal>
    );
}
