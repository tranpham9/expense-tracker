type RefreshJWTResponse = object;

type UsersRegisterResponse = { message: string };
export type UsersLoginResponse = {
    userId: string;
    name: string;
    email: string;
    jwt: string; // rest of the responses don't need to specify this explicitly
};
type UsersUpdateResponse = object; // empty response (when ignoring jwt)
type UsersForgotPasswordResponse = { message: string };
type UsersResetPasswordResponse = { message: string };

export type Trip = {
    name: string;
    description: string;
    inviteCode: string;
    // leaderId: ObjectId;
    // memberIds: ObjectId[];
    leaderId: string;
    memberIds: string[];
};
type TripsSearchResponse = {
    trips: Trip[];
    unpaginatedTripCount: number;
    pageCount: number;
};

export type Responses = {
    refreshJWT: RefreshJWTResponse;

    "users/register": UsersRegisterResponse;
    "users/login": UsersLoginResponse;
    "users/update": UsersUpdateResponse;
    "users/forgotPassword": UsersForgotPasswordResponse;
    "users/resetPassword": UsersResetPasswordResponse;

    "trips/search": TripsSearchResponse;
};
