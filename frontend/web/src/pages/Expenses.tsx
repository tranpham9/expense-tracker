import {
    Alert,
    Avatar,
    AvatarGroup,
    Badge,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Snackbar,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// import { getInitials } from "../utility/Manipulation";
import { useComputed, useSignal, useSignalEffect, useSignals } from "@preact/signals-react/runtime";
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
import CreateExpenseOverlay from "../components/CreateExpenseOverlay";
import EditExpenseOverlay from "../components/EditExpenseOverlay";
// TODO: use this for generating the expense report
// import GenerateReportIcon from "@mui/icons-material/CurrencyExchange";

// TODO: probably remove avatar group and turn them into cards and have cards to include $ owe to friends
export default function Expenses() {
    useSignals();

    const members = useSignal<Member[]>([]);
    const membersIncludingUser = useComputed(() => {
        const { userId: _id, name, email, bio } = userInfo.value!;
        const user: Member = { _id, name, email, bio, isLeader: false }; // just assume they aren't leader; this info (whether they are leader) isn't needed
        return members.value.concat([user]);
    });
    const expenses = useSignal<Expense[] | null>(null);
    // 2D Map of the form [ower][owed] -> amountOwed ("ower" owes "owed" "amountOwed")
    const amountsOwed = useComputed(() => {
        const owedMap: Map<string, Map<string, number>> = new Map();
        expenses.value?.forEach((expense) => {
            expense.memberIds.forEach((memberId) => {
                const owerMap = owedMap.get(memberId);
                const amountOwed = expense.cost / (expense.memberIds.length + 1);
                if (owerMap) {
                    owerMap.set(expense.payerId, (owerMap.get(expense.payerId) || 0) + amountOwed);
                } else {
                    owedMap.set(memberId, new Map([[expense.payerId, amountOwed]]));
                }
            });
        });

        return owedMap;
    });
    const query = useSignal("");

    const isSnackbarOpen = useSignal(false);
    const snackbarContents = useSignal<{ message: string; severity: "success" | "error" }>({ message: "", severity: "success" });

    const isCreateExpenseOverlayVisible = useSignal(false);
    const activeDeleteConfirmationDialog = useSignal(""); // houses the id of the current expense which has a confirmation dialog open for it

    const expenseToEdit = useSignal<Expense | null>(null);

    // https://stackoverflow.com/questions/74413650/what-is-difference-between-usenavigate-and-redirect-in-react-route-v6
    const navigate = useNavigate();

    // TODO: will need to globally store current tripid or something like that
    // FIXME: maybe the expenses button should also only be enabled in the navbar if a tripid is specified (otherwise, redirect user to trips page)
    // const expenses = useSignal<Expense[] | null>(null);

    const loadAllData = (tripId: string) => {
        request(
            "trips/getMembers",
            { tripId },
            (response) => {
                console.log(response);
                // makes leader first, then sorts rest normally
                response.members.sort((member1, member2) => +member2.isLeader - +member1.isLeader || member1.name.localeCompare(member2.name));
                console.log("sorted members", response);
                members.value = response.members;
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
        request(
            "trips/listExpenses",
            { tripId },
            (response) => {
                console.log(response);
                expenses.value = response.expenses;
            },
            (errorMessage) => {
                console.log(errorMessage);
            }
        );
    };

    const performDelete = (expenseId: string) => {
        request(
            "expenses/delete",
            { expenseId },
            (response) => {
                console.log(response);

                loadAllData(currentTrip.value!._id);
            },
            console.error
        );
    };

    // NOTE: this also runs when isLoggedIn is first computed
    useSignalEffect(() => {
        if (isLoggedIn.value) {
            console.log("<loaded exenses page while logged in>");
            // untracked(defaultSearch);

            if (currentTrip.value) {
                loadAllData(currentTrip.value._id);
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

    const RenderedExpenses = () => {
        // NOTE: this seemingly wasn't needed (so maybe the way this component was instantiated within the top-level return properly propogated changes, i.e. rerendering), but I want to avoid any potiential bugs down the line
        useSignals();

        return (
            <Stack sx={{ textAlign: "center", mx: { md: 4 } }}>
                {expenses.value
                    ?.filter((expense) => {
                        const searchTerm = query.value.toLocaleLowerCase();
                        return (
                            expense.name.toLocaleLowerCase().includes(searchTerm) ||
                            expense.description.toLocaleLowerCase().includes(searchTerm) ||
                            getFormattedCurrency(expense.cost).includes(searchTerm)
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
                                        <Box
                                            display="inline-block"
                                            textAlign="left"
                                            whiteSpace="pre-wrap"
                                        >
                                            {expense.description}
                                        </Box>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={1}
                                        sm={1}
                                    >
                                        <Typography>{getFormattedCurrency(expense.cost)}</Typography>
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
                                                    <Typography variant="body2">
                                                        {payerName} (Payer)
                                                        <br />
                                                        Owed {getFormattedCurrency(expense.cost - amountOwedPer)}
                                                    </Typography>
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
                                                                <Typography variant="body2">
                                                                    {memberName}
                                                                    {isMemberTheUser ? " (You)" : ""}
                                                                    <br />
                                                                    Owes {getFormattedCurrency(amountOwedPer)}
                                                                </Typography>
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
                                                expenseToEdit.value = expense;
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <Tooltip
                                            title={<Typography variant="body2">Delete</Typography>}
                                            arrow
                                        >
                                            <IconButton
                                                type="button"
                                                aria-label="Delete Expense"
                                                sx={{ p: "5px" }}
                                                onClick={() => {
                                                    activeDeleteConfirmationDialog.value = expense._id;
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Dialog
                                            open={activeDeleteConfirmationDialog.value === expense._id}
                                            onClose={() => {
                                                activeDeleteConfirmationDialog.value = "";
                                            }}
                                        >
                                            <Paper elevation={2}>
                                                <DialogTitle>{"Confirm Expense Deletion"}</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText whiteSpace="pre-wrap">
                                                        Are you sure you want to delete "{expense.name}"?{"\n"}This is not reversible.
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions sx={{ pb: 2, pr: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            activeDeleteConfirmationDialog.value = "";
                                                        }}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        No
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => {
                                                            activeDeleteConfirmationDialog.value = "";

                                                            performDelete(expense._id);
                                                        }}
                                                    >
                                                        Yes
                                                    </Button>
                                                </DialogActions>
                                            </Paper>
                                        </Dialog>
                                    </Grid>
                                </Grid>
                            </Paper>
                        );
                    })}
            </Stack>
        );
    };

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
                <Divider
                    orientation="vertical"
                    flexItem
                />
                <Tooltip
                    title={<Typography variant="body2">Copy Join Code</Typography>}
                    arrow
                >
                    <Button
                        onClick={() =>
                            navigator.clipboard
                                .writeText(currentTrip.value?.inviteCode.toString() || "")
                                .then(() => {
                                    isSnackbarOpen.value = true;
                                    snackbarContents.value = {
                                        message: "Succesfully copied join code.",
                                        severity: "success",
                                    };
                                })
                                .catch(() => {
                                    isSnackbarOpen.value = true;
                                    snackbarContents.value = {
                                        message: "Failed to copy join code.",
                                        severity: "error",
                                    };
                                })
                        }
                        variant="text"
                        color="info"
                        size="large"
                        sx={{
                            p: "2px",
                            flexShrink: 0,
                            fontWeight: "bold",
                        }}
                    >
                        Code: {currentTrip.value?.inviteCode}
                    </Button>
                </Tooltip>
                <Snackbar
                    key={Math.random()}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={isSnackbarOpen.value}
                    autoHideDuration={5000}
                    onClose={() => {
                        isSnackbarOpen.value = false;
                    }}
                >
                    <Paper elevation={1}>
                        <Alert
                            severity={snackbarContents.value.severity}
                            variant="outlined"
                        >
                            {snackbarContents.value.message}
                        </Alert>
                    </Paper>
                </Snackbar>
                <Divider
                    orientation="vertical"
                    flexItem
                />
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
                    {members.value.map((member, i) => {
                        const amountOwedFormatted = getFormattedCurrency(amountsOwed.value.get(userInfo.value?.userId || "INVALID_USER_ID")?.get(member._id) || 0);

                        return (
                            <Tooltip
                                key={i}
                                title={
                                    <Box textAlign="center">
                                        <Typography variant="body2">
                                            {member.name}
                                            {member.isLeader ? " (Leader)" : ""}
                                            <br />
                                            You owe them {amountOwedFormatted}
                                        </Typography>
                                    </Box>
                                }
                                arrow
                            >
                                <Chip
                                    avatar={<Avatar sx={{border: "1px solid black"}}>{getInitials(member.name)}</Avatar>}
                                    // avatar={<Avatar>{getInitials(member.name)}</Avatar>}
                                    label={amountOwedFormatted}
                                    {...(member.isLeader && {
                                        sx: {
                                            border: "2px solid",
                                            borderColor: "secondary.contrastText",
                                        },
                                    })}
                                />
                            </Tooltip>
                        );
                    })}
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
                    title={<Typography variant="body2">Create Expense</Typography>}
                    arrow
                >
                    <IconButton
                        type="button"
                        aria-label="Create Expense"
                        sx={{ p: "10px", ml: 1 }}
                        onClick={() => {
                            isCreateExpenseOverlayVisible.value = true;
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            {expenses.value ? <RenderedExpenses /> : <LoadingSkeleton />}
            <CreateExpenseOverlay
                isCreateExpenseOverlayVisible={isCreateExpenseOverlayVisible}
                tripMembers={members}
                onSuccessfulCreate={() => {
                    loadAllData(currentTrip.value!._id);
                }}
            />
            <EditExpenseOverlay
                expenseToEdit={expenseToEdit}
                tripMembersIncludingUser={membersIncludingUser}
                onSuccessfulEdit={() => {
                    loadAllData(currentTrip.value!._id);
                }}
            />
        </>
    );
}
