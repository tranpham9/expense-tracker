import { Avatar, AvatarGroup, Box, Button, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getInitials } from "../utility/Manipulation";

// TODO: get member names from backend
const members: string[] = ["Joe Bro", "Bob", "Carol", "David", "Emily"];

// TODO: probably remove avatar group and turn them into cards and have cards to include $ owe to friends
export default function Expenses() {
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
                        {members.map((member, i) => (
                            <Avatar key={i}>{getInitials(member)}</Avatar>
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
