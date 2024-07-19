type UsersRegisterResponse = { message: string };
export type UsersLoginResponse = {
    userId: string;
    name: string;
    email: string;
    jwt: string; // rest of the responses don't need to specify this explicitly
};
type UsersUpdateResponse = object; // empty response (when ignoring jwt)
type UsersForgotPasswordPayload = { message: string };
type UsersResetPasswordPayload = { message: string };

export type Responses = {
    "users/register": UsersRegisterResponse;
    "users/login": UsersLoginResponse;
    "users/update": UsersUpdateResponse;
    "users/forgotPassword": UsersForgotPasswordPayload;
    "users/resetPassword": UsersResetPasswordPayload;
};
