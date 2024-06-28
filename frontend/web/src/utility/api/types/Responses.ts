// FIXME: the API shouldn't return anything once email auth is set up
type RegisterUserResponse = {
    userId: string;
};
type LoginResponse = {
    jwt: string;
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
