import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Contexts/Account";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Grid, Paper, Skeleton, Stack } from "@mui/material";

export default function Trips() {
    const navigate = useNavigate();

    const { isLoggedIn } = useContext(LoginContext);

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    useEffect(() => {
        if (!isLoggedIn) {
            console.log("<not logged in>");
            navigate("/home");
        }
    }, [isLoggedIn, navigate]); // always trigger when navigating to here (navigate changes when path changes)

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 2,
                }}
            >
                <SearchBar />
            </Box>
            <Stack sx={{ textAlign: "center" }}>
                {[...Array(10).keys()].map((i) => (
                    <Paper key={i} sx={{ m: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Grid
                            container
                            m={2}
                            spacing={2}
                        >
                            <Grid
                                item
                                xs={2}
                            >
                                <Skeleton width="100%" />
                                <Skeleton width="100%" />
                            </Grid>
                            <Grid
                                item
                                xs={8}
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
