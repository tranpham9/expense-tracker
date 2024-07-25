/*
import { Payloads } from "./types/Payloads";
import { Responses } from "./types/Responses";
// import fetch from "node-fetch";
// import fetch from "node-fetch";
// import 'node-fetch';
// jest.mock('node-fetch', () => jest.fn());
import "isomorphic-fetch";

const BASE_API_PATH = "https://accountability-190955e8b06f.herokuapp.com/api";

export async function request<T extends keyof Payloads>(type: T, payload: Payloads[T], success: (response: Responses[T]) => void, fail: (errorMessage: string) => void) {
    try {
        const response = await fetch(`${BASE_API_PATH}/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // always pass in jwt where possible (api will ignore it if it's not needed); the only exception is when a special jwt is used for reset password
            // body: JSON.stringify({ ...payload, ...(type !== "users/resetPassword" && { jwt: userJWT.value }) }),
            body: JSON.stringify(payload),
        });
        switch (response.status) {
            // status OK
            case 200: {
                const json = JSON.parse(await response.text());
                success(json);
                // this must be updated *after* success is run since success might update the account information (which jwt changing relies on)
                // if (json.jwt && userInfo.value) {
                //     // userJWT.value = json.jwt;
                //     // userInfo.value.jwt = json.jwt;
                //     // TODO: I don't think that objects are "deeply reactive," so I believe that reassignment to the object itself is required (as opposed to just doing signal.obj.prop = ...)
                //     userInfo.value = { ...userInfo.value, jwt: json.jwt };
                // }
                break;
            }
            // status UNAUTHENTICATED
            case 401: {
                // userJWT.value = null;
                // userInfo.value = null;

                const json = JSON.parse(await response.text());
                fail(json.error);
                break;
            }
            default: {
                fail("Operation failed");
                break;
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            fail(error.message);
        }
    }
}
*/
