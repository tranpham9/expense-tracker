import express, { json, urlencoded } from "express";
import { join } from "path";

import bodyParser from "body-parser";
import cors from "cors";

require("dotenv").config();
// Heroku will pass the port we must listen on via the environment, otherwise default to 5000.
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;
import { MongoClient } from "mongodb";
const client = new MongoClient(uri);
client.connect();

// express app
const app = express();
app.use(cors());

// Allow all CORS Requests (ie. allow SwaggerHub to make API calls)
app.use(cors());
// Parse incoming JSON, if any
app.use(json());
app.use(urlencoded({ extended: true }));

// register
app.post("/api/registerUser", async (req, res, next) => {
    const db = client.db("appData");
    const userColl = db.collection("User");
    const tripColl = db.collection("Trip");

    // incoming name, email, password, tripId(invitation)

    const { name, email, password, tripId } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: "Bad Request" });
    }
    let newUser = {
        name: name,
        email: email,
        password: password,
        trips: [tripId],
    };
    try {
        const check = await userColl.find(newUser.email);
        if (check) res.status(500).json({ error: "Failed to register user" });
        // Update users collection with the new user
        await userColl.insertOne(newUser);

        // query for the _id automatically created by mongodb
        const query = { email: email };
        const projection = { _id: 1 };

        // retrieve only the _id from the database
        const result = await userColl.findOne(query, projection);
        if (result) res.status(200).json({ message: "User registered successfully" });
        else {
            res.status(500).json({ error: "Failed to register user" });
        }

        // If tripId is provided, update trips collection to add user to the trip
        if (tripId) {
            await tripColl.updateOne(
                { _id: ObjectId(tripId) }, // Find the trip by tripId
                { $push: { User: result._id } } // Add newUserId to the users array in the trip document
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
