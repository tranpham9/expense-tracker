import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Grid, Pagination, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { isLoggedIn } from "../Signals/Account";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { request } from "../utility/api/API";
import { Trip } from "../utility/api/types/Responses";

export default function Trips() {
    useSignals();

    const navigate = useNavigate();

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    /*
    useEffect(() => {
        if (!isLoggedIn) {
            console.log("<not logged in>");
            navigate("/home");
        }
    }, [isLoggedIn, navigate]); // always trigger when navigating to here (navigate changes when path changes)
    */
    /*
    useEffect(() => {
        isLoggedIn.subscribe(() => {
            if (!isLoggedIn.value) {
                console.log("<not logged in>");
                navigate("/home");
            }
        });
    }, []);
    */
    const trips = useSignal<Trip[] | null>(null);

    // redirect if not logged in  (on mount/after first paint)
    useEffect(() => {
        if (!isLoggedIn.value) {
            console.log("<not logged in>");
            navigate("/home");
            return;
        }
    }, []);

    useSignalEffect(() => {
        if (isLoggedIn.value) {
            console.log("Just became logged in; running signal effect in Trips");

            request(
                "trips/search",
                {},
                (response) => {
                    trips.value = response.trips;
                },
                (errorMessage) => {
                    console.trace("uhoh", errorMessage);
                }
            );
        } else {
            console.log("<no longer logged in>");
            navigate("/home");
        }
    });

    useSignalEffect(() => {
        console.log("Trips changed", trips);
    });

    // TODO: extract this to its own file once pagination isproperly set up in api
    const [page, setPage] = useState(1);
    const LinkedPagination = ({ isEnabled = true }) => (
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
                disabled={!isEnabled}
                onChange={(_event, page) => setPage(page)}
            />
        </Box>
    );

    const LoadingSkeleton = () => (
        <Stack sx={{ textAlign: "center" }}>
            {[...Array(10).keys()].map((i) => (
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
    );

    const RenderedTrips = () => (
        <Stack sx={{ textAlign: "center" }}>
            {trips.value?.map((trip, i) => (
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
                        alignItems="center"
                    >
                        <Grid
                            item
                            xs={2}
                        >
                            <Typography>{trip.name}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={8}
                        >
                            {trip.description}
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
            {(!trips.value || trips.value.length) && <LinkedPagination isEnabled={!!trips.value} />}
            {trips.value ? <RenderedTrips /> : <LoadingSkeleton />}
            <LinkedPagination isEnabled={!!trips.value} />
        </>
    );
}
