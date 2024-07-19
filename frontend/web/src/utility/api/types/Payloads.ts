type RegisterUserPayload = {
    name: string;
    email: string;
    password: string;
};
type LoginPayload = {
    email: string;
    password: string;
};

export type Payloads = {
    "users/register": RegisterUserPayload;
    "users/login": LoginPayload;
};
