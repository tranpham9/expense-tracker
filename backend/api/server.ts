import "dotenv/config";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cors from "cors";
import { Collection, MongoClient, ObjectId } from "mongodb";
import { createToken } from "./createJWT";
import { createEmail } from "./tokenSender";
import jwt, { JsonWebTokenError, decode } from "jsonwebtoken";
import { router as tripCRUDRouter } from "./routes/tripCRUD";
import { router as expenseCRUDRouter } from "./routes/expenseCRUD";
import { unverified } from "./tokenSender";

//TODO: make api endpoints more modular

// Heroku will pass the port we must listen on via the environment, otherwise default to 5000.
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
client.connect();

const DB_NAME = "appData";
const USER_COLLECTION_NAME = "User";
const TRIP_COLLECTION_NAME = "Trip";

const HOMEPAGE = "https://accountability-190955e8b06f.herokuapp.com"
// express app
const app = express();

// Allow all CORS Requests (ie. allow SwaggerHub to make API calls)
app.use(cors());
// Parse incoming JSON, if any
app.use(json());
app.use(urlencoded({ extended: true }));

type User = {
    name: string;
    email: string;
    password: string;
    trips: ObjectId[];
};

type Trip = {
    name: string;
    notes: string;
    memberIds: ObjectId[];
    leaderId: ObjectId;
};

app.get("/api/verify/:token", async (req, res, next) => {
    const db = client.db(DB_NAME);
    const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);
    const tripCollection: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

    // get User document from token
    const verified = unverified.get(req.params.token);
    console.log(req.params.token);

    try {
        if (verified) {
            // insert new user
            const insertionResult = await userCollection.insertOne(verified);
            if (!insertionResult.acknowledged) {
                console.error("Failed to insert new user");
                res.status(401).json({ error: "Failed to register user" });
                return;
            }
            res.status(308).redirect(HOMEPAGE);
        }

        /*// if tripId is provided, add user to trip
            if (verified?.trips) {
                // use createFromHexString ( https://github.com/dotansimha/graphql-code-generator/issues/6830#issuecomment-2105266455 )
                // TODO: might need to handle this failing?  Would need to check .acknowledged boolean
                await tripCollection.updateOne({ _id: ObjectId.createFromHexString(tripId) }, { $push: { memberIds: insertionResult.insertedId } });
            }*/
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(401).json({ error: "Failed to register user" });
        next();
    }
});

// Verify that the Content-Type header is set the JSON (otherwise the json,
// middleware won't parse the body). Could help the frontend guys to diagnose
// errors.
app.use("/api/", (req, res, next) => {
    if (req.headers["content-type"] != "application/json") {
        // dirty check, could be improved
        res.statusCode = 400; // 400 Bad Request
        res.json({});
        return;
    }
    next();
});

// register
app.post("/api/registerUser", async (req, res, next) => {
    const db = client.db(DB_NAME);
    const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);
    const tripCollection: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

    // incoming: name, email, password, tripId? (invitation)

    const { name, email, password, tripId } = req.body;
    if (!name || !email || !password) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
        res.status(400).json({ error: "Malformed Request" });
        return;
    }
    /*if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            res.status(406).json("Must be a valid email");
            return;
    }*/
   
    // TODO: need to validate email is in valid form and that nothing is too long
    // TODO: ensure trips should also include non-owning trips (i.e. ones where the user is a part of but not the creater/owner of)
    const newUser: User = {
        name: name.toString(),
        email: (email.toString() as string).trim().toLocaleLowerCase(), // trimmed and converted to lowercase in order to properly detect whether email already exists
        password: password.toString(),
        trips: [tripId && ObjectId.createFromHexString(tripId.toString())],
    };
    // ensure email doesn't already exist
    const check = await userCollection.findOne({ email: email, verified: true });
    // console.log(check);
    if (check) {
        console.error("Attempted to register a user with an existing email");
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
        res.status(401).json({ error: "Failed to register user" });
        return;
    }

    // method that sends an email with the token
    await createEmail(newUser);

    // console.log("A user was registered successfully");
    res.status(200);
});

app.post("/api/login", async (req, res, next) => {
    const db = client.db(DB_NAME);
    const userCollection = db.collection(USER_COLLECTION_NAME);

    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Malformed Request" });
        return;
    }

    // trimmed and converted to lowercase to standardize format of emails
    const properEmail = (email.toString() as string).trim().toLocaleLowerCase();

    var ret;

    const foundUser = await userCollection.findOne({ email: properEmail });
    if (foundUser && password === foundUser.password) {
        console.log(foundUser.password);
        ret = createToken(foundUser._id, foundUser.name, foundUser.email);
        res.status(200).json({
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            ret,
        });
    } else {
        res.status(401).json({ error: "Invalid login credentials" });
    }
});

app.put("/api/changeName", async (req, res) => {
    const db = client.db(DB_NAME);
    const userCollection = db.collection(USER_COLLECTION_NAME);
    const {userId,newName} = req.body;
    if(!userId||!newName){
        res.status(400).json({ error: "Malformed Request" });
        return;
    }
    const result = await userCollection.updateOne(
        { _id: ObjectId.createFromHexString(userId.toString()) },
        { $set: { name: newName } }
    );

    if (result.modifiedCount === 1) {
        res.status(200).json({ message: "Name updated successfully" });
    } else {
        res.status(400).json({ error: "Failed to update name" });
    }


 });

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
