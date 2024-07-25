import { request } from "./API_ForTesting";

const EXISTING_EMAIL = "REDACTED";
const NEW_EMAIL = "REDACTED";
const HASHED_PASSWORD = "REDACTED";
const JWT = "REDACTED";

describe("Register from website", () => {
    test("New Email", (done) => {
        request(
            "users/register",
            { email: NEW_EMAIL, name: "Gertrude Bones", password: HASHED_PASSWORD },
            (response) => {
                expect(response.message).toBeTruthy();
                done();
            },
            done
        );
    });

    test("Existing Email", (done) => {
        request("users/register", { email: NEW_EMAIL, name: "Gertrude Bones", password: HASHED_PASSWORD }, done, (errorMessage) => {
            expect(errorMessage).toBeTruthy();
            done();
        });
    });
});

describe("Login from Website", () => {
    test("Valid Account", (done) => {
        request(
            "users/login",
            { email: EXISTING_EMAIL, password: HASHED_PASSWORD },
            (response) => {
                expect(response.name).toBe("Main Account");
                done();
            },
            done
        );
    });

    test("Invalid Account", (done) => {
        request("users/login", { email: NEW_EMAIL, password: HASHED_PASSWORD }, done, (errorMessage) => {
            expect(errorMessage).toBeTruthy();
            done();
        });
    });
});

describe("Create Trip from Website", () => {
    test("Valid Name", (done) => {
        const payload = {
            name: "From Testing Suite",
            jwt: JWT,
        };

        request(
            "trips/create",
            payload,
            (response) => {
                expect(response.tripId).toBeTruthy();
                done();
            },
            done
        );
    });

    test("Invalid Name", (done) => {
        const payload = {
            name: "",
            jwt: JWT,
        };

        request("trips/create", payload, done, (errorMessage) => {
            expect(errorMessage).toBeTruthy();
            done();
        });
    });
});
