type RefreshJWTPayload = object;

type UsersRegisterPayload = {
    name: string;
    email: string;
    password: string;
    bio?: string;
};
type UsersLoginPayload = {
    email: string;
    password: string;
};
type UsersUpdatePayload = {
    name?: string;
    bio?: string;
    // isAuthenticatedRoute: true;
};
type UsersForgotPasswordPayload = { email: string };
type UsersResetPasswordPayload = { newPassword: string };

type TripsSearchPaylod = {
    query?: string;
    page?: number;
};
export type TripsCreatePayload = {
    name: string;
    description?: string;
};
type TripsGetMembersPayload = { tripId: string };
type TripsListExpensesPayload = { tripId: string };
export type TripsUpdatePayload = {
    tripId: string;
    name?: string;
    description?: string;
};
type TripsDeletePayload = { tripId: string };
type TripsJoinPayload = { inviteCode: string };

export type ExpensesCreatePayload = {
    tripId: string;
    name: string;
    description?: string;
    cost: number;
    memberIds: string[];
};
export type ExpensesUpdatePayload = {
    expenseId: string;
    name?: string;
    description?: string;
    cost?: number;
    memberIds: string[];
};
type ExpensesDeletePayload = { expenseId: string };

export type Payloads = {
    refreshJWT: RefreshJWTPayload;

    "users/register": UsersRegisterPayload;
    "users/login": UsersLoginPayload;
    "users/update": UsersUpdatePayload;
    "users/forgotPassword": UsersForgotPasswordPayload;
    "users/resetPassword": UsersResetPasswordPayload;

    "trips/search": TripsSearchPaylod;
    "trips/create": TripsCreatePayload;
    "trips/getMembers": TripsGetMembersPayload;
    "trips/listExpenses": TripsListExpensesPayload;
    "trips/update": TripsUpdatePayload;
    "trips/delete": TripsDeletePayload;
    "trips/join": TripsJoinPayload;

    "expenses/create": ExpensesCreatePayload;
    "expenses/update": ExpensesUpdatePayload;
    "expenses/delete": ExpensesDeletePayload;
};
