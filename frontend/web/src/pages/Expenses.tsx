import { Box, Grid, Paper, Skeleton, Stack } from "@mui/material";

//TODO: change array to be dynamically sized, we don't need pagination for expenses
export default function Expenses() {
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 2,
                }}
            >
                <h1>Trip Name Expenses</h1>
            </Box>
            <Stack sx={{ textAlign: "center" }}>
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
