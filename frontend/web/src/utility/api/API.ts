import { Payloads } from "./types/Payloads";
import { Responses } from "./types/Responses";

const basePath = "https://accountability-190955e8b06f.herokuapp.com/api";

export async function request<T extends keyof Payloads>(type: T, payload: Payloads[T], success: (response: Responses[T]) => void, fail: (errorMessage: string) => void) {
    try {
        const response = await fetch(`${basePath}/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        switch (response.status) {
            case 200: {
                const json = JSON.parse(await response.text());
                success(json);
                break;
            }
            default: {
                // TODO: properly impl
                fail("ERROR");
                break;
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            fail(error.message);
        }
    }
}
