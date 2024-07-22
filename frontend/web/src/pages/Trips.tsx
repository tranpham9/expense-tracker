import { useNavigate } from "react-router-dom";
import SearchBar from "../components/inputs/SearchBar";
import { Box, Divider, Grid, IconButton, Pagination, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { isLoggedIn, userInfo } from "../Signals/Account";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { request } from "../utility/api/API";
import { Trip } from "../utility/api/types/Responses";
import { untracked } from "@preact/signals-react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
// import OpenTripIcon from "@mui/icons-material/Login";
import OpenExpensesIcon from "@mui/icons-material/AttachMoney";
import CreateTripOverlay from "../components/CreateTripOverlay";
import { currentTrip } from "../Signals/Trip";
import LoadingSkeleton from "../components/LoadingSkeleton";

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
                        <Divider
                            orientation="vertical"
                            flexItem
                            // right margin of -1px is required to not break grid ( https://stackoverflow.com/questions/63712269/material-ui-using-divider-breaks-the-grid )
                            // top margin of 2 is done to account for outer grid padding of 2 which is only accounted for in the bottom maring of this element for some reason
                            sx={{ mr: "-1px", mt: 2 }}
                        />
                        <Grid
                            item
                            xs={2}
                            sm={4}
                            md={8}
                        >
                            <Box
                                display="inline-block"
                                textAlign="left"
                                whiteSpace="pre-wrap"
                            >
                                {trip.description}
                            </Box>
                        </Grid>
                        <Divider
                            orientation="vertical"
                            flexItem
                            // right margin of -1px is required to not break grid ( https://stackoverflow.com/questions/63712269/material-ui-using-divider-breaks-the-grid )
                            // top margin of 2 is done to account for outer grid padding of 2 which is only accounted for in the bottom maring of this element for some reason
                            sx={{ mr: "-1px", mt: 2 }}
                        />
                        <Grid
                            item
                            xs={5}
                            sm={4}
                            md={2}
                            textAlign="right"
                        >
                            <Tooltip
                                title="Edit"
                                arrow
                            >
                                <IconButton
                                    type="button"
                                    disabled={trip.leaderId !== userInfo.value?.userId}
                                    sx={{ p: "5px" }}
                                    onClick={() => {
                                        // TODO: impl
                                    }}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                title="Delete"
                                arrow
                            >
                                <IconButton
                                    type="button"
                                    disabled={trip.leaderId !== userInfo.value?.userId}
                                    sx={{ p: "5px" }}
                                    onClick={() => {
                                        // TODO: impl
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            {/* TODO: find out if these tooltips have any issues at the bottom of the page (probably not since there is enough of a gap from the pagination at the bottom anyway) */}
                            <Tooltip
                                title="Open Expenses"
                                arrow
                            >
                                <IconButton
                                    type="button"
                                    // disabled={*}
                                    sx={{ p: "5px" }}
                                    onClick={() => {
                                        currentTrip.value = trip;
                                        navigate("/expenses");
                                    }}
                                >
                                    <OpenExpensesIcon />
                                </IconButton>
                            </Tooltip>
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
                    placeholder="Search Trips"
                    isBuffering={isBuffering.value}
                    onChange={(event) => {
                        searchInputText.value = event.target.value;
                    }}
                    onSearch={(query) => performSearch(query, 1)}
                />
                <Tooltip
                    title="Create Trip"
                    arrow
                >
                    <IconButton
                        type="button"
                        // disabled={*}
                        sx={{ p: "10px", ml: 1 }}
                        onClick={() => {
                            isCreateTripOverlayVisible.value = true;
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
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
