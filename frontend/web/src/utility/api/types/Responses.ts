type RegisterUserResponse = {
    message: string;
};
export type LoginResponse = {
    // FIXME: the server shouldn't really be sending id as its own field since it's part of the jwt (and the jwt probably shouldn't have name included within it)
    id: string;
    name: string;
    email: string;
    // FIXME: this is currently the wrong type for the jwt; for whatever reason, the api is sending it in a nested object...
    // jwt: string;
    token: { accessToken: string };
};

export type Responses = {
    registerUser: RegisterUserResponse;
    login: LoginResponse;
};
