import "dotenv/config";
import express, { json, urlencoded } from "express";
import { join } from "path";
import cors from "cors";
import { Collection, MongoClient, ObjectId } from "mongodb";

// Heroku will pass the port we must listen on via the environment, otherwise default to 5000.
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
client.connect();

const DB_NAME = "appData";
const USER_COLLECTION_NAME = "User";
const TRIP_COLLECTION_NAME = "Trip";

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

    // TODO: need to validate email is in valid form and that nothing is too long
    const newUser: User = {
        name: name.toString(),
        email: (email.toString() as string).trim().toLocaleLowerCase(), // trimmed and converted to lowercase in order to properly detect whether email already exists
        password: password.toString(),
        trips: [], // the user doesn't own the provided tripId; they are only added *to* it
    };

    try {
        // ensure email doesn't already exist
        const check = await userCollection.findOne({ email });
        if (check) {
            console.error("Attempted to register a user with an existing email");
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
            res.status(401).json({ error: "Failed to register user" });
            return;
        }

        // insert new user
        const insertionResult = await userCollection.insertOne(newUser);
        if (!insertionResult.acknowledged) {
            console.error("Failed to insert new user");
            res.status(401).json({ error: "Failed to register user" });
            return;
        }

        // if tripId is provided, add user to trip
        if (tripId) {
            // use createFromHexString ( https://github.com/dotansimha/graphql-code-generator/issues/6830#issuecomment-2105266455 )
            // TODO: might need to handle this failing?  Would need to check .acknowledged boolean
            await tripCollection.updateOne({ _id: ObjectId.createFromHexString(tripId) }, { $push: { memberIds: insertionResult.insertedId } });
        }
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(401).json({ error: "Failed to register user" });
        return;
    }

    console.log("A user was registered successfully");
    res.status(200).json({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res, next) => {
    const db = client.db(DB_NAME);
    const userCollection = db.collection(USER_COLLECTION_NAME);

    const { email, password } = req.body;

    const user = await userCollection.findOne({ email: email });

    if (user) {
        const result = password === user.password;

        if (result) {
            res.status(200).json({ message: user._id });
        } else {
            res.status(400).json({ error: "Email/Password doesn't match" });
        }
    } else {
        res.status(500).json({ error: "User doesn't exist" });
    }
});

// Serve the static frontend files
const FRONTEND_DIST_PATH = join(__dirname, "../../frontend/web/dist");
app.use(express.static(FRONTEND_DIST_PATH));

// any get request provides the index.html file (which avoids issues with pathing/routing)
app.get("*", (req, res, next) => {
    res.sendFile(join(FRONTEND_DIST_PATH, "index.html"));
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
