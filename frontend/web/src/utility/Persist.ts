// import { decode, JwtPayload } from "jsonwebtoken";
import { UsersLoginResponse } from "./api/types/Responses";

export function saveAccountInfo(account: UsersLoginResponse) {
    console.log("Account info updated to", account);
    localStorage.setItem("account", JSON.stringify(account));
}

export function clearAccountInfo() {
    localStorage.removeItem("account");
}

// FIXME: eventually, this should be able to instead hit a refresh endpoint, after which either the refreshed token will be returned, or it will give an error status code due to already being expired (at which point there is no account info to login [so delete account info])
// FIXME(2): also, I believe that, in addition to the "iat" in the payload, the server should somehow be putting an "exp" inside it, after which jwt.verify() can be used.
//      https://jwt.io/
//      https://github.com/auth0/node-jsonwebtoken/blob/master/README.md#jwtverifytoken-secretorpublickey-options-callback
export function loadAccountInfo() {
    const accountString = localStorage.getItem("account");
    if (!accountString) {
        return null;
    }

    return JSON.parse(accountString) as UsersLoginResponse;
    // NOTE: unfortunately, the decode() function doesn't work locally hosted it seems: https://github.com/auth0/node-jsonwebtoken/issues/954
    /*
    const account = JSON.parse(accountString) as LoginResponse;
    const jwt = decode(account.token.accessToken, { complete: true });
    if (!jwt) {
        return null;
    }

    const minutesSinceIssued = (Date.now() - (jwt.payload as JwtPayload).iat! * 1000) / 1000 / 60;
    return minutesSinceIssued <= 30 ? account : null;
    */
}

/*
export function saveJWT(jwt: string) {
    localStorage.setItem("jwt", jwt);
}

export function getJWT() {
    return localStorage.getItem("jwt");
}
*/
