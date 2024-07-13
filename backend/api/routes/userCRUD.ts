import express from "express";
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, Trip, TRIP_COLLECTION_NAME, User, USER_COLLECTION_NAME } from "./common";
import { Collection, ObjectId } from "mongodb";
import { createEmail, resetPasswordEmail, resetPasswordMap ,unverified} from "../tokenSender";
import * as createJWT from "../createJWT";

export const router = express.Router();

router.post("/registerUser", async (req, res, next) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);
        //remove name field so user can signup without a name
        const { name, email, password, tripId } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: "Malformed Request" });
            return;
        }
        /*if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            res.status(406).json("Must be a valid email");
            return;
    }*/

        // TODO: ensure trips should also include non-owning trips (i.e. ones where the user is a part of but not the creater/owner of)
        const newUser: User = {
            name: name.toString(),
            email: (email.toString() as string).trim().toLocaleLowerCase(),
            password: password.toString(),
            trips: tripId ? [ObjectId.createFromHexString(tripId.toString())] : [],
        };

        // ensure email doesn't already exist
        const check = await userCollection.findOne({ email: email });
        // console.log(check);
        if (check) {
            console.error("Attempted to register a user with an existing email");
            res.status(401).json({ error: "Failed to register user" });
            return;
        }

        // method that sends an email with the token
        await createEmail(newUser);

        // console.log("A user was registered successfully");
        res.status(200);
    } catch (err) {}
});
router.post("/login", async (req, res, next) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection = db.collection(USER_COLLECTION_NAME);

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Malformed Request" });
            return;
        }

        // trimmed and converted to lowercase to standardize format of emails
        const properEmail = (email.toString() as string).trim().toLocaleLowerCase();

        const foundUser = await userCollection.findOne({ email: properEmail });
        if (foundUser && password === foundUser.password) {
            const jwt = createJWT.createToken(foundUser._id, foundUser.name, foundUser.email);
            res.status(200).json({
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                jwt,
            });
        } else {
            res.status(401).json({ error: "Invalid login credentials" });
        }
    } catch (err) {}
});
router.put("/changeName", async (req, res) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection = db.collection(USER_COLLECTION_NAME);

        const { userId, newName, jwtToken} = req.body;

        // Check if the jwt has expired
        if(createJWT.isExpired(jwtToken) !== null){
            createJWT.refresh(jwtToken);
        }
        if (!userId || !newName) {
            res.status(400).json({ error: "Malformed Request" });
            return;
        }
        const result = await userCollection.updateOne({ _id: ObjectId.createFromHexString(userId.toString()) }, { $set: { name: newName } });

        if (result.modifiedCount === 1) {
            res.status(200).json({ message: "Name updated successfully" });
        } else {
            res.status(400).json({ error: "Failed to update name" });
        }
    } catch (err) {}
});
router.post("/forgotPassword", async (req, res) => {
    // incoming email
    const email = req.body;

    await resetPasswordEmail(email);
});
router.get("/resetPassword/:token", async (req, res) => {
    // incoming email and new password
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME)

    const {email, newPassword} = req.body;

    if (email === resetPasswordMap.get(req.params.token)){
        const updatedResult = await userCollection.updateOne({email: email}, {password: newPassword});
    }
});
router.get("/verify/:token", async (req, res) => {
    const client = await getMongoClient();
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
            // If we get here, we're successfully verified
            // Remove from unverified list to prevent double registration
            unverified.delete(req.params.token);
            /*
            // Redirect to the application's homepage (static files root)
            res.status(308).redirect('/');
            */
            // Show some basic HTML that redirects to homepage after 5 seconds
            res.status(200).send(`
                <html>
                <head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta http-equiv="refresh" content="5;url=/" />
                </head>
                <body>
                <h3>Verification successful. Please return to your app or main website. Redirecting in 5 seconds.</h3>
                </body>
                </html>
            `);
            return; // Ensure no further code executes

            /*// if tripId is provided, add user to trip
            if (verified?.trips) {
                // use createFromHexString ( https://github.com/dotansimha/graphql-code-generator/issues/6830#issuecomment-2105266455 )
                // TODO: might need to handle this failing?  Would need to check .acknowledged boolean
                await tripCollection.updateOne({ _id: ObjectId.createFromHexString(tripId) }, { $push: { memberIds: insertionResult.insertedId } });
            }*/
        }
    } catch (err) {
        console.error("Error registering user:", err);
        if (!res.headersSent) {
            res.status(401).json({ error: "Failed to register user" });
        }
        return;
    }

    // We get here if verification wasn't successful
    if (!res.headersSent) {
        res.status(401).json({ error: "Invalid registration token" });
    }
});
