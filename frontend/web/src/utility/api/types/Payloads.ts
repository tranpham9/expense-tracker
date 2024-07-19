type UsersRegisterPayload = {
    name: string;
    email: string;
    password: string;
};
type UsersLoginPayload = {
    email: string;
    password: string;
};

export type Payloads = {
    "users/register": UsersRegisterPayload;
    "users/login": UsersLoginPayload;
};
