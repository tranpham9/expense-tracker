import { userJWT } from "../../Signals/Account";
import { Payloads } from "./types/Payloads";
import { Responses } from "./types/Responses";

const BASE_API_PATH = "https://accountability-190955e8b06f.herokuapp.com/api";

export async function request<T extends keyof Payloads>(type: T, payload: Payloads[T], success: (response: Responses[T]) => void, fail: (errorMessage: string) => void) {
    try {
        const response = await fetch(`${BASE_API_PATH}/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // always pass in jwt where possible (api will ignore it if it's not needed)
            body: JSON.stringify({ ...payload, jwt: userJWT.value }),
        });
        switch (response.status) {
            // status OK
            case 200: {
                const json = JSON.parse(await response.text());
                if (json.jwt) {
                    userJWT.value = json.jwt;
                }
                success(json);
                break;
            }
            // status UNAUTHENTICATED
            case 401: {
                userJWT.value = null;

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
