import { Button, Divider, Grid, Paper, Skeleton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

//TODO: change array to be dynamically sized, we don't need pagination for expenses
export default function Expenses() {
    return (
        <>
            <Grid></Grid>
            <Divider />
            <Grid
                direction="row"
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mx: 4,
                    my: 2,
                }}
            >
                <Typography variant="h5">{"Expense Name"}</Typography>
                <Button startIcon={<AddIcon />}> Add Expenses </Button>
            </Grid>
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
