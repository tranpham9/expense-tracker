type UsersRegisterResponse = {
    message: string;
};
export type UsersLoginResponse = {
    userId: string;
    name: string;
    email: string;
    jwt: string;
};

export type Responses = {
    "users/register": UsersRegisterResponse;
    "users/login": UsersLoginResponse;
};
