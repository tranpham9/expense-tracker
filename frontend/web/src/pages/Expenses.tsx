import { Avatar, AvatarGroup, Box, Button, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getInitials } from "../utility/Manipulation";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../Signals/Account";
import { signal } from "@preact/signals-react";
import { request } from "../utility/api/API";
import { Member } from "../utility/api/types/Responses";

export const currentTripId = signal("");

// TODO: probably remove avatar group and turn them into cards and have cards to include $ owe to friends
export default function Expenses() {
    useSignals();

    const members = useSignal<Member[]>([]);
    //  = useComputed(() => {
    useSignalEffect(() => {
        if (!currentTripId.value) {
            members.value = [];
        }

        request(
            "trips/getMembers",
            { tripId: currentTripId.value },
            (response) => {
                console.log(response);
                members.value = response.members;
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    });

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    const navigate = useNavigate();

    // TODO: will need to globally store current tripid or something like that
    // FIXME: maybe the expenses button should also only be enabled in the navbar if a tripid is specified (otherwise, redirect user to trips page)
    // const expenses = useSignal<Expense[] | null>(null);

    // NOTE: this also runs when isLoggedIn is first computed
    useSignalEffect(() => {
        if (isLoggedIn.value) {
            console.log("<loaded exenses page while logged in>");
            // untracked(defaultSearch);

            if (!currentTripId.value) {
                console.log("<no trip selected>");
                navigate("/trips");
            }
        } else {
            // console.log("<no longer logged in>");
            console.log("<not logged in>");
            navigate("/home");
        }
    });

    // useSignalEffect(() => {
    //     console.log("Trips changed", trips.value);
    // });

    return (
        <>
            <Grid
                container
                direction={"row"}
                justifyContent={"space-between"}
                px={4}
                py={2}
            >
                <Grid item>
                    <Typography variant="h4">{"Trip Expense"}</Typography>
                </Grid>
                <Grid item>
                    <AvatarGroup
                        max={4}
                        spacing={4}
                    >
                        {members.value.map((member, i) => (
                            <Avatar key={i}>{getInitials(member.name)}</Avatar>
                        ))}
                    </AvatarGroup>
                </Grid>
            </Grid>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    px: 4,
                }}
            >
                <Button startIcon={<AddIcon />}> Add an Expense </Button>
            </Box>
            <Stack sx={{ textAlign: "center", mx: 4 }}>
                {[...Array(20).keys()].map((i) => (
                    <Paper
                        key={i}
                        elevation={10}
                        sx={{
                            m: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Grid
                            container
                            p={2}
                            spacing={2}
                        >
                            <Grid
                                item
                                xs={10}
                            >
                                <Skeleton width="100%" />
                                <Skeleton width="100%" />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <Skeleton width="100%" />
                                <Skeleton width="100%" />
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Stack>
        </>
    );
}
