type RegisterUserResponse = {
    message: string;
};
export type LoginResponse = {
    userId: string;
    name: string;
    email: string;
    jwt: string;
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
