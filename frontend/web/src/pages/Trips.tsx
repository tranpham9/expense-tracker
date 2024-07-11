import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Contexts/Account";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Grid, Pagination, Paper, Skeleton, Stack } from "@mui/material";

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

    // TODO: extract this to its own file once pagination isproperly set up in api
    const [page, setPage] = useState(1);
    const LinkedPagination = () => (
        <Box
            sx={{
                m: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Pagination
                count={10}
                color="primary"
                page={page}
                onChange={(_event, page) => setPage(page)}
            />
        </Box>
    );

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
                <SearchBar />
            </Box>
            <LinkedPagination />
            <Stack sx={{ textAlign: "center" }}>
                {[...Array(10).keys()].map((i) => (
                    <Paper
                        key={i}
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
                <LinkedPagination />
            </Stack>
        </>
    );
}
