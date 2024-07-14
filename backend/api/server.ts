import "dotenv/config";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cors from "cors";
import { isExpired, refresh } from "./JWT";
import { router as tripCRUDRouter } from "./routes/tripCRUD";
import { router as expenseCRUDRouter } from "./routes/expenseCRUD";
import { router as userCRUDRouter } from "./routes/userCRUD";
import { STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND, STATUS_OK, STATUS_UNAUTHENTICATED } from "./routes/common";

// Heroku will pass the port we must listen on via the environment, otherwise default to 5000.
const port = process.env.PORT || 5000;

// express app
const app = express();

// Allow all CORS Requests (ie. allow SwaggerHub to make API calls)
app.use(cors());
// Parse incoming JSON, if any
app.use(json());
app.use(urlencoded({ extended: true }));

app.post("/api/refreshJWT", async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(STATUS_BAD_REQUEST).json({ error: "Token is required" });
    }

    try {
        // Check if the token is expired
        const expired = isExpired(token);
        if (expired) {
            return res.status(STATUS_UNAUTHENTICATED).json({ error: "Token has expired" });
        }

        // Refresh the token
        const newToken = refresh(token);
        if (!newToken) {
            return res.status(STATUS_BAD_REQUEST).json({ error: "Could not refresh token" });
        }
        return res.status(STATUS_OK).json({ token: newToken });
    } catch (error) {
        return res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "error" });
    }
});

// All user related CRUD endpoints will be accessible under /api/
app.use("/api/users", userCRUDRouter);
// All trip related CRUD endpoints will be accessible under /api/trips/
app.use("/api/trips", tripCRUDRouter);
// All expense related CRUD endpoints will be accessible under /api/expenses/
app.use("/api/expenses", expenseCRUDRouter);

app.post("*", (req, res, next) => {
    res.status(STATUS_NOT_FOUND).json({ error: "Invalid endpoint" });
});

// Serve the static frontend files
const FRONTEND_DIST_PATH = join(__dirname, "../../../frontend/web/dist"); // starting from dist folder for server.js (compiled from server.ts)
app.use(express.static(FRONTEND_DIST_PATH));

// any get request provides the index.html file (which avoids issues with pathing/routing)
app.get("*", (req, res, next) => {
    res.sendFile(join(FRONTEND_DIST_PATH, "index.html"));
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
