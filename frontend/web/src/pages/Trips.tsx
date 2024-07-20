import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Grid, IconButton, Pagination, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { isLoggedIn } from "../Signals/Account";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { request } from "../utility/api/API";
import { Trip } from "../utility/api/types/Responses";
import { untracked } from "@preact/signals-react";
import AddIcon from "@mui/icons-material/Add";

export default function Trips() {
    useSignals();

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    const navigate = useNavigate();

    const trips = useSignal<Trip[] | null>(null);

    /*
    const defaultSearch = () => {
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
    };
    */

    const performSearch = (query = "", page = 1) => {
        console.log("searching for", query);

        isBuffering.value = true;

        request(
            "trips/search",
            { query, page },
            (response) => {
                trips.value = response.trips;
                setPage(page);
                console.log(response.trips, trips.value);

                isBuffering.value = false;
            },
            (errorMessage) => {
                console.log(errorMessage);

                isBuffering.value = false;
            }
        );
    };

    // NOTE: this also runs when isLoggedIn is first computed
    useSignalEffect(() => {
        if (isLoggedIn.value) {
            console.log("<loaded trips page while logged in>");
            untracked(performSearch);
        } else {
            // console.log("<no longer logged in>");
            console.log("<not logged in>");
            navigate("/home");
        }
    });

    useSignalEffect(() => {
        console.log("Trips changed", trips.value);
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
                onChange={(_event, page) => {
                    setPage(page);
                    performSearch(searchInputText.value, page);
                }}
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
                        alignItems={"center"}
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

    const isBuffering = useSignal(false);
    const searchInputText = useSignal("");

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
                <SearchBar
                    isBuffering={isBuffering.value}
                    onChange={(event) => {
                        searchInputText.value = event.target.value;
                    }}
                    onSearch={(query) => performSearch(query, 1)}
                />
                <IconButton
                    type="button"
                    // disabled={*}
                    sx={{ p: "10px", ml: 1 }}
                    aria-label="add"
                    onClick={() => {}}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            {!trips.value || trips.value.length ? <LinkedPagination isEnabled={!!trips.value} /> : <></>}
            {trips.value ? <RenderedTrips /> : <LoadingSkeleton />}
            {/* TODO: is this too flashy?  The search query finishes quite quickly, so this pops up on screen very briefly; it ends up rather jarring */}
            {/* {!isBuffering.value && trips.value ? <RenderedTrips /> : <LoadingSkeleton />} */}
            <LinkedPagination isEnabled={!!trips.value} />
        </>
    );
}
