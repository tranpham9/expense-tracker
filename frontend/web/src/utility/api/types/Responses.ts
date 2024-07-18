type RegisterUserResponse = {
    message: string;
};
export type LoginResponse = {
    token: { accessToken: string };
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
