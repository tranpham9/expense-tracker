type RegisterUserResponse = {
    message: string;
};
export type LoginResponse = {
    // FIXME: the server shouldn't really be sending id as its own field since it's part of the jwt (and the jwt probably shouldn't have name included within it)
    id: string;
    name: string;
    email: string;
    jwt: string;
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
