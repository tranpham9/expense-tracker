import { useNavigate } from "react-router-dom";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Grid, IconButton, Pagination, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { isLoggedIn, userInfo } from "../Signals/Account";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { request } from "../utility/api/API";
import { Trip } from "../utility/api/types/Responses";
import { untracked } from "@preact/signals-react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenTripIcon from "@mui/icons-material/Login";
import CreateTripOverlay from "../components/CreateTripOverlay";
import { currentTripId } from "../Signals/Trip";

// TODO: potentially make search term and current page persistent by pulling their signals out of the function

export default function Trips() {
    useSignals();

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    const navigate = useNavigate();

    const trips = useSignal<Trip[] | null>(null);
    const searchInputText = useSignal("");
    const isBuffering = useSignal(false);
    const currentPage = useSignal(1);
    const pageCount = useSignal(1);
    const isCreateTripOverlayVisible = useSignal(false);

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
        console.log("Trips changed to", trips.value);
    });

    const performSearch = (query = "", page = 1) => {
        if (isBuffering.value) {
            console.log("can't search while a search request is inflight");
            console.warn("ideally, this should never be reached");
            return;
        }

        console.log("searching for", query);

        isBuffering.value = true;

        request(
            "trips/search",
            { query, page },
            (response) => {
                trips.value = response.trips;
                currentPage.value = page;
                pageCount.value = response.pageCount;
                console.log(response);
                console.log(response.trips, trips.value);

                isBuffering.value = false;
            },
            (errorMessage) => {
                console.log(errorMessage);

                isBuffering.value = false;
            }
        );
    };

    // TODO: potentially extract this to its own file?  (This would be low pirority though, since linked pagination isn't needed anywhere else)
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
                count={pageCount.value}
                color="primary"
                page={currentPage.value}
                disabled={!isEnabled}
                onChange={(_event, page) => {
                    // TODO: might want to instead make this a part of the disabled state, though it might be a bit clunky if all the buttons are constantly going between disabled and not
                    if (isBuffering.value) {
                        console.log("can't search while a search request is inflight");
                        return;
                    }

                    currentPage.value = page;
                    performSearch(searchInputText.value, page);
                }}
            />
        </Box>
    );

    const LoadingSkeleton = () => (
        <Stack sx={{ textAlign: "center", mx: { md: 4 } }}>
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
        <Stack sx={{ textAlign: "center", mx: { md: 4 } }}>
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
                            xs={5}
                            sm={4}
                            md={2}
                        >
                            <Typography>{trip.name}</Typography>
                        </Grid>
                        <Grid
                            item
                            xs={2}
                            sm={4}
                            md={8}
                        >
                            <Box whiteSpace="pre-wrap">{trip.description}</Box>
                        </Grid>
                        <Grid
                            item
                            xs={5}
                            sm={4}
                            md={2}
                            textAlign="right"
                        >
                            <IconButton
                                type="button"
                                disabled={trip.leaderId !== userInfo.value?.userId}
                                sx={{ p: "5px" }}
                                aria-label="edit"
                                onClick={() => {
                                    // TODO: impl
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                type="button"
                                disabled={trip.leaderId !== userInfo.value?.userId}
                                sx={{ p: "5px" }}
                                aria-label="delete"
                                onClick={() => {
                                    // TODO: impl
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <IconButton
                                type="button"
                                // disabled={*}
                                sx={{ p: "5px" }}
                                aria-label="open trip"
                                onClick={() => {
                                    currentTripId.value = trip._id;
                                    navigate("/expenses");
                                }}
                            >
                                <OpenTripIcon />
                            </IconButton>
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
                    onClick={() => {
                        isCreateTripOverlayVisible.value = true;
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            {!trips.value || trips.value.length ? <LinkedPagination isEnabled={!!trips.value} /> : <></>}
            {trips.value ? <RenderedTrips /> : <LoadingSkeleton />}
            {/* TODO: is this too flashy?  The search query finishes quite quickly, so this pops up on screen very briefly; it ends up rather jarring */}
            {/* {!isBuffering.value && trips.value ? <RenderedTrips /> : <LoadingSkeleton />} */}
            <LinkedPagination isEnabled={!!trips.value} />
            <CreateTripOverlay isCreateTripOverlayVisible={isCreateTripOverlayVisible} />
        </>
    );
}
