import { Avatar, Box, Chip, Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import { getInitials } from "../utility/Manipulation";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../Signals/Account";
import { request } from "../utility/api/API";
import { Expense, Member } from "../utility/api/types/Responses";
import { currentTripId, currentTripInfo } from "../Signals/Trip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/inputs/SearchBar";
// TODO: use this for generating the expense report
// import GenerateReportIcon from "@mui/icons-material/CurrencyExchange";

// TODO: probably remove avatar group and turn them into cards and have cards to include $ owe to friends
export default function Expenses() {
    useSignals();

    const members = useSignal<Member[]>([]);
    const expenses = useSignal<Expense[] | null>(null);
    const query = useSignal("");

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

            if (currentTripId.value) {
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
                request(
                    "trips/listExpenses",
                    { tripId: currentTripId.value },
                    (response) => {
                        console.log(response);
                        expenses.value = response.expenses;
                    },
                    (errorMessage) => {
                        console.log(errorMessage);
                    }
                );
            } else {
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

    const RenderedExpenses = () => (
        <Stack sx={{ textAlign: "center", mx: { md: 4 } }}>
            {expenses.value
                ?.filter((expense) => {
                    const searchTerm = query.value.toLocaleLowerCase();
                    return expense.name.toLocaleLowerCase().includes(searchTerm) || expense.description.toLocaleLowerCase().includes(searchTerm) || `$${expense.cost.toFixed(2)}`.includes(searchTerm); // || members.value.some((member) => expense.memberIds.includes(member.))
                })
                .map((expense, i) => (
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
                                <Typography>{expense.name}</Typography>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                                sm={4}
                                md={8}
                            >
                                <Box whiteSpace="pre-wrap">{expense.description}</Box>
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
                                    sx={{ p: "5px" }}
                                    aria-label="delete"
                                    onClick={() => {
                                        // TODO: impl
                                    }}
                                >
                                    <DeleteIcon />
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
                    alignItems: "center",
                    gap: 2,
                    m: 2,
                }}
            >
                <Typography
                    variant="h5"
                    flexShrink={0}
                >
                    {currentTripInfo.value.name}
                </Typography>
                {/* <Typography>{currentTripInfo.value.description}</Typography> */}
                {/* <Stack direction="row" spacing={1} overflow="auto"> */}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: { xs: "nowrap", md: "wrap" },
                        overflow: "auto",
                        gap: 1,
                    }}
                >
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>XY</Avatar>}
                        label="$479.24"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>XY</Avatar>}
                        label="$479.24"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>XY</Avatar>}
                        label="$479.24"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>XY</Avatar>}
                        label="$479.24"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>XY</Avatar>}
                        label="$479.24"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                    <Chip
                        avatar={<Avatar>JZ</Avatar>}
                        label="$2.48"
                    />
                </Box>
                {/* </Stack> */}
                {/* <Grid
                    container
                    direction={"row"}
                    justifyContent={"space-between"}
                    px={4}
                    py={2}
                >
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
                </Grid> */}
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    m: 2,
                }}
            >
                <SearchBar
                    placeholder="Search Expenses"
                    onChange={(event) => {
                        query.value = event.target.value;
                    }}
                    // onSearch={(currentQuery) => {
                    //     query.value = currentQuery;
                    // }}
                />
                <IconButton
                    type="button"
                    // disabled={*}
                    sx={{ p: "10px", ml: 1 }}
                    aria-label="add"
                    onClick={() => {
                        // isCreateTripOverlayVisible.value = true;
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            {expenses.value ? <RenderedExpenses /> : <LoadingSkeleton />}
        </>
    );
}
