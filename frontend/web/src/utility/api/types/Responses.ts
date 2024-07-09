// FIXME: the API shouldn't return anything once email auth is set up
type RegisterUserResponse = {
    message: string;
};
type LoginResponse = {
    jwt: string;
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
