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

export type Payloads = {
    "users/register": UsersRegisterPayload;
    "users/login": UsersLoginPayload;
    "users/update": UsersUpdatePayload;
    "users/forgotPassword": UsersForgotPasswordPayload;
    "users/resetPassword": UsersResetPasswordPayload;
};
