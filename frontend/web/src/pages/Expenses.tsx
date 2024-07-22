import { Avatar, AvatarGroup, Badge, Box, Button, Chip, Divider, Grid, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import { getInitials } from "../utility/Manipulation";
import { useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, userInfo } from "../Signals/Account";
import { request } from "../utility/api/API";
import { Expense, Member } from "../utility/api/types/Responses";
import { currentTrip } from "../Signals/Trip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/inputs/SearchBar";
import { getFormattedCurrency, getInitials } from "../utility/Manipulation";
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

            if (currentTrip.value) {
                request(
                    "trips/getMembers",
                    { tripId: currentTrip.value._id },
                    (response) => {
                        console.log(response);
                        // makes leader first, then sorts rest normally
                        response.members.sort((member1, member2) => +member2.isLeader - +member1.isLeader || member1.name.localeCompare(member2.name));
                        console.log(response);
                        members.value = response.members;
                    },
                    (errorMessage) => {
                        console.log(errorMessage);
                    }
                );
                request(
                    "trips/listExpenses",
                    { tripId: currentTrip.value._id },
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
                    return (
                        expense.name.toLocaleLowerCase().includes(searchTerm) || expense.description.toLocaleLowerCase().includes(searchTerm) || getFormattedCurrency(expense.cost).includes(searchTerm)
                    ); // || members.value.some((member) => expense.memberIds.includes(member.))
                })
                .map((expense, i) => {
                    const isPayerTheUser = expense.payerId === userInfo.value?.userId;
                    const payerName = members.value.find((member) => member._id === expense.payerId)?.name || (isPayerTheUser && userInfo.value?.name) || "";
                    const amountOwedPer = expense.cost / (expense.memberIds.length + 1);

                    return (
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
                                    xs={3}
                                    sm={2}
                                >
                                    <Typography>{expense.name}</Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    sm={4}
                                >
                                    {/* FIXME: should probably be Typography? */}
                                    <Box whiteSpace="pre-wrap">{expense.description}</Box>
                                </Grid>
                                <Grid
                                    item
                                    xs={1}
                                    sm={1}
                                >
                                    {getFormattedCurrency(expense.cost)}
                                </Grid>
                                {/* TODO: maybe make this look nicer at smaller screen sizes */}
                                <Grid
                                    item
                                    xs={2}
                                    sm={3}
                                    display="flex"
                                    gap={1}
                                >
                                    <Tooltip
                                        title={
                                            <Box textAlign="center">
                                                {payerName} (Payer)
                                                <br />
                                                Owed {getFormattedCurrency(expense.cost - amountOwedPer)}
                                            </Box>
                                        }
                                        arrow
                                    >
                                        <Badge
                                            overlap="circular"
                                            variant="dot"
                                            badgeContent=" "
                                            color="error"
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "right",
                                            }}
                                            invisible={!isPayerTheUser}
                                        >
                                            <Avatar
                                                sx={{
                                                    border: "2px solid",
                                                    borderColor: "secondary.contrastText",
                                                    // accounts for border
                                                    width: 44,
                                                    height: 44,
                                                }}
                                            >
                                                {getInitials(payerName)}
                                            </Avatar>
                                        </Badge>
                                    </Tooltip>
                                    <AvatarGroup sx={{ pl: 1 }}>
                                        {expense.memberIds.map((memberId) => {
                                            const isMemberTheUser = memberId === userInfo.value?.userId;
                                            const memberName = members.value.find((member) => member._id === memberId)?.name || (isMemberTheUser && userInfo.value?.name) || "";

                                            return (
                                                <Tooltip
                                                    key={memberId}
                                                    title={
                                                        <Box textAlign="center">
                                                            {memberName}
                                                            {isMemberTheUser ? " (You)" : ""}
                                                            <br />
                                                            Owes {getFormattedCurrency(amountOwedPer)}
                                                        </Box>
                                                    }
                                                    arrow
                                                >
                                                    <Badge
                                                        overlap="circular"
                                                        variant="dot"
                                                        badgeContent=" "
                                                        color="error"
                                                        anchorOrigin={{
                                                            vertical: "bottom",
                                                            horizontal: "right",
                                                        }}
                                                        invisible={!isMemberTheUser}
                                                    >
                                                        <Avatar sx={{ width: 40, height: 40 }}>{getInitials(memberName)}</Avatar>
                                                    </Badge>
                                                </Tooltip>
                                            );
                                        })}
                                    </AvatarGroup>
                                </Grid>
                                <Grid
                                    item
                                    xs={3}
                                    sm={2}
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
                    );
                })}
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
                    {currentTrip.value?.name}
                </Typography>
                <Divider orientation="vertical" flexItem />
                <Typography
                    variant="body1"
                    flexShrink={0}
                >
                    {currentTrip.value?.inviteCode}
                </Typography>
                <Divider orientation="vertical" flexItem />
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
                    {members.value.map((member, i) => (
                        <Tooltip
                            key={i}
                            title={
                                <Box textAlign="center">
                                    {member.name}
                                    {member.isLeader ? " (Leader)" : ""}
                                    <br />
                                    {/* TODO: impl */}
                                    You owe them {getFormattedCurrency(0)}
                                </Box>
                            }
                            arrow
                        >
                            <Chip
                                avatar={<Avatar>{getInitials(member.name)}</Avatar>}
                                // TODO: impl
                                label="$0.00"
                                {...(member.isLeader && {
                                    sx: {
                                        border: "2px solid",
                                        borderColor: "secondary.contrastText",
                                    },
                                })}
                            />
                        </Tooltip>
                    ))}
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
                <Tooltip
                    title="Create Expense"
                    arrow
                >
                    <IconButton
                        type="button"
                        // disabled={*}
                        sx={{ p: "10px", ml: 1 }}
                        onClick={() => {
                            // isCreateTripOverlayVisible.value = true;
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {expenses.value ? <RenderedExpenses /> : <LoadingSkeleton />}
        </>
    );
}
