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

// express app
const app = express();

// Allow all CORS Requests (ie. allow SwaggerHub to make API calls)
app.use(cors());
// Parse incoming JSON, if any
app.use(json());
app.use(urlencoded({ extended: true }));

type User = {
    _id?: ObjectId;
    name: string;
    email: string;
    password: string;
    trips: ObjectId[];
};

type Trip = {
    _id?: ObjectId;
    name: string;
    notes: string;
    memberIds: ObjectId[];
    leaderId: ObjectId;
};

// register
app.post("/api/registerUser", async (req, res, next) => {
    const db = client.db("appData");
    const userColl: Collection<User> = db.collection("User");
    const tripColl: Collection<Trip> = db.collection("Trip");

    // incoming name, email, password, tripId(invitation)

    const { name, email, password, tripId } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: "Bad Request" });
    }

    const newUser: User = {
        name: name,
        email: email,
        password: password,
        trips: [tripId],
    };
    try {
        const check = await userColl.find({ email: newUser.email });
        if (check) {
            res.status(500).json({ error: "Failed to register user" });
        }

        // Update users collection with the new user
        await userColl.insertOne(newUser);

        // query for the _id automatically created by mongodb
        // retrieve only the _id from the database
        const result = await userColl.findOne({ email }, { projection: { _id: true } });
        if (result) {
            res.status(200).json({ message: "User registered successfully" });
        } else {
            res.status(500).json({ error: "Failed to register user" });
        }

        // If tripId is provided, update trips collection to add user to the trip
        if (tripId) {
            // use createFromHexString ( https://github.com/dotansimha/graphql-code-generator/issues/6830#issuecomment-2105266455 )
            await tripColl.updateOne(
                { $push: { User: result._id } } // Add newUserId to the users array in the trip document
                { _id: ObjectId.createFromHexString(tripId) }, // Find the trip by tripId
            );
        }
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ error: "Failed to register user" });
    }
});

app.post("/api/login", async (req, res, next) => {
    const db = client.db("appData");
    const userColl = db.collection("User");

    const { email, password } = req.body;

    const user = await userColl.findOne({ email: email });

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
app.use(express.static(join(__dirname, "../../frontend/web/dist")));

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
