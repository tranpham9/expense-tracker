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
    registerUser: RegisterUserPayload;
    login: LoginPayload;
};
