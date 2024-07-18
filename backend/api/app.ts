import express, { json, urlencoded } from "express";
import cors from "cors";
import { router as tripCRUDRouter } from "./routes/tripCRUD";
import { router as expenseCRUDRouter } from "./routes/expenseCRUD";
import { router as userCRUDRouter } from "./routes/userCRUD";

function createServer() {
    // express app
    const app = express();

    // Allow all CORS Requests (ie. allow SwaggerHub to make API calls)
    app.use(cors());
    // Parse incoming JSON, if any
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // All user related CRUD endpoints will be accessible under /api/
    app.use("/api/users", userCRUDRouter);
    // All trip related CRUD endpoints will be accessible under /api/trips/
    app.use("/api/trips", tripCRUDRouter);
    // All expense related CRUD endpoints will be accessible under /api/expenses/
    app.use("/api/expenses", expenseCRUDRouter);
    return app;
}

export default createServer;
