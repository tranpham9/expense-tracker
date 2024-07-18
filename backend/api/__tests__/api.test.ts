import supertest from "supertest";
import createServer from "../app";

const app = createServer();
const request = supertest(app);

describe("test", () => {
    // eslint-disable-next-line no-var
    let jwt: string = "";
    describe("loginHandler", () => {
        describe("given no request", () => {
            it("should return a 400", async () => {
                await request.post("/api/users/login").expect(400);
            });
        });
        describe("given a request", () => {
            it("should respond with a json", async () => {
                const response = await request.post("/api/users/login").send({ email: "test@example.com", password: "COP4331" });
                expect(response.status).toEqual(200);
                expect(response.body.id);
                expect(response.body.name);
                expect(response.body.email);
                expect(response.body.jwt);
                jwt = response.body.jwt;
            });
        });
    });

    describe("creating a trip", () => {
        describe("given no request", () => {
            it("should return a 400", async () => {
                await request.post("/api/trips/create").expect(400);
            })
        })
        describe("given a tripId, name, and jwt", () => {
            it("should respond with a json", async () => {
                const response = await request.post("/api/trips/create").send({description: "Unit Testing Description", name: "Unit Testing", jwt: jwt});
                expect(response.status).toEqual(200);
                expect(response.body.tripId);
                expect(response.body.jwt);
                jwt = response.body.jwt;
            })
        })
    });
});
