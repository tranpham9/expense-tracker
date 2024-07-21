type RefreshJWTResponse = object;

type UsersRegisterResponse = { message: string };
export type UsersLoginResponse = {
    userId: string;
    name: string;
    email: string;
    // rest of the responses don't need to specify this explicitly
    jwt: string;
};
type UsersUpdateResponse = object; // empty response (when ignoring jwt)
type UsersForgotPasswordResponse = { message: string };
type UsersResetPasswordResponse = { message: string };

export type Trip = {
    _id: string;
    name: string;
    description: string;
    inviteCode: string;
    leaderId: string;
    // NOTE: probably not needed at this point
    memberIds: string[];
};
type TripsSearchResponse = {
    trips: Trip[];
    unpaginatedTripCount: number;
    pageCount: number;
};
type TripsCreateResponse = {
    // kept in for compatibility
    tripId: string;
    trip: Trip;
};
export type Member = {
    name: string;
    bio: string;
    email: string;
    isLeader: boolean;
};
type TripsGetMembersResponse = { members: Member[] };
export type Expense = {
    _id: string;
    name: string;
    description: string;
    cost: number;
    tripId: string;
    payerId: string;
    memberIds: string[];
};
type TripsListExpensesResponse = { expenses: Expense[] };

export type Responses = {
    refreshJWT: RefreshJWTResponse;

    "users/register": UsersRegisterResponse;
    "users/login": UsersLoginResponse;
    "users/update": UsersUpdateResponse;
    "users/forgotPassword": UsersForgotPasswordResponse;
    "users/resetPassword": UsersResetPasswordResponse;

    "trips/search": TripsSearchResponse;
    "trips/create": TripsCreateResponse;
    "trips/getMembers": TripsGetMembersResponse;
    "trips/listExpenses": TripsListExpensesResponse;
};
