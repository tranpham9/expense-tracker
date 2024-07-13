import "dotenv/config";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cors from "cors";
import { isExpired, refresh } from "./JWT";
import { router as tripCRUDRouter } from "./routes/tripCRUD";
import { router as expenseCRUDRouter } from "./routes/expenseCRUD";
import { router as userCRUDRouter } from "./routes/userCRUD";

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
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        // Check if the token is expired
        const expired = isExpired(token);
        if (expired) {
            return res.status(401).json({ error: "Token has expired" });
        }

        // Refresh the token
        const newToken = refresh(token);
        if (!newToken) {
            return res.status(400).json({ error: "Could not refresh token" });
        }
        return res.status(200).json({ jwt: newToken });
    } catch (error) {
        return res.status(500).json({ error: "error" });
    }
});

// JWT Verification - For any routes declared *below* this one,
// verification will be enforced with some exceptions.
app.use("/api/", (req, res, next) => {
    let exceptions = ["/users/login", "/users/registerUser", "/users/forgotPassword", "/users/resetPassword "];
    if (exceptions.some((prefix) => req.path.startsWith(prefix))) {
        // bypass verification for the paths above
        next();
        return;
    }

    if (!req.body.jwt || isExpired(req.body.jwt)) {
        // terminates the response
        res.statusCode = 400;
        res.json({ error: "JWT token not provided or invalid/expired" });
        return;
    }

    // JWT is good! Generate and keep track of a new token
    res.locals.refreshedJWT = refresh(req.body.jwt)?.toString();

    /* Then only adding this to each route's response is needed:
        req.json({
        ...
        jwt: res.locals.refreshedJWT
        });
     */
    next(); // continue processing this request
});

// All user related CRUD endpoints will be accessible under /api/
app.use("/api/users", userCRUDRouter);
// All trip related CRUD endpoints will be accessible under /api/trips/
app.use("/api/trips", tripCRUDRouter);
// All expense related CRUD endpoints will be accessible under /api/expenses/
app.use("/api/expenses", expenseCRUDRouter);

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
