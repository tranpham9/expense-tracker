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

type TripsCreatePayload = {
    name?: string;
    description?: string;
};

type TripsGetMembersPayload = {
    tripId: string;
};

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
};
