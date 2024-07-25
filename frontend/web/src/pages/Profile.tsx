import { useSignal, useSignals } from "@preact/signals-react/runtime";
import { useParams } from "react-router-dom";
import { UsersGetResponse } from "../utility/api/types/Responses";
import { useEffect } from "react";
import { request } from "../utility/api/API";
import { Avatar, Box, Divider, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { getInitials } from "../utility/Manipulation";

export default function Profile() {
    useSignals();
    // const { name, email, bio } = useParams();
    const { userId } = useParams();

    const user = useSignal<UsersGetResponse | null>();

    useEffect(() => {
        if (!userId) {
            return;
        }

        request(
            "users/get",
            { userId },
            (response) => {
                console.log(response);

                user.value = response;
            },
            console.warn
        );
    }, [userId]);

    return user.value ? (
        <Paper
            elevation={10}
            sx={{
                p: 5,
                m: "40px auto",
                maxWidth: "min(80%, 800px)",
            }}
        >
            <Box
                display="flex"
                justifyContent="center"
            >
                <Avatar
                    sx={{
                        width: 80,
                        height: 80,
                        fontSize: 40,
                        mr: 4,
                        my: "auto",
                    }}
                >
                    {getInitials(user.value.name)}
                </Avatar>
                <Stack sx={{ my: "auto" }}>
                    <Typography variant="h4">{user.value.name}</Typography>
                    <Typography variant="body2">{user.value.email}</Typography>
                </Stack>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Box textAlign="center">
                <Typography
                    flexGrow={1}
                    display="inline-block"
                    textAlign="left"
                    whiteSpace="pre-wrap"
                >
                    {user.value.bio || "(No bio provided)"}
                </Typography>
            </Box>
        </Paper>
    ) : (
        <Paper
            elevation={10}
            sx={{
                p: 5,
                m: "40px auto",
                maxWidth: "min(80%, 800px)",
            }}
        >
            <Box
                display="flex"
                justifyContent="center"
            >
                <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    sx={{
                        mr: 4,
                        my: "auto",
                    }}
                />
                <Stack sx={{ my: "auto" }}>
                    <Skeleton
                        width={200}
                        height={60}
                    />
                    <Skeleton
                        width={200}
                        height={30}
                    />
                </Stack>
            </Box>
            <Divider sx={{ my: 4 }} />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </Paper>
    );
}
