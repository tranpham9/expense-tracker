import express from "express";
import { DB_NAME, getMongoClient, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_OK, STATUS_UNAUTHENTICATED, Trip, TRIP_COLLECTION_NAME, User, USER_COLLECTION_NAME } from "./common";
import { Collection, ObjectId } from "mongodb";
import { createEmail, resetPasswordEmail, unverified } from "../tokenSender";
import { verify } from "jsonwebtoken";
import md5 from "md5";
import { authenticationRouteHandler, createJWT, extract, extractUserId, isExpired, refresh } from "../JWT";

export const router = express.Router();

const AUTHENTICATED_ROUTES = ["/changeName", "/joinTrip"];

// JWT Verification
router.use(AUTHENTICATED_ROUTES, authenticationRouteHandler);

router.post("/register", async (req, res, next) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);
        // TODO: I believe we don't need an optional trip id here anymore?
        const { name, email, password, tripId } = req.body;
        if (!name || !email || !password) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
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
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Failed to register user" });
            return;
        }

        // method that sends an email with the token
        await createEmail(newUser);

        // console.log("A user was registered successfully");
        res.status(STATUS_OK);
    } catch (err) {}
});

router.post("/login", async (req, res, next) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection = db.collection(USER_COLLECTION_NAME);

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        // trimmed and converted to lowercase to standardize format of emails
        const properEmail = (email.toString() as string).trim().toLocaleLowerCase();

        const foundUser = await userCollection.findOne({ email: properEmail });
        if (foundUser && password === foundUser.password) {
            const jwt = createJWT(foundUser._id, foundUser.email);
            res.status(STATUS_OK).json({
                name: foundUser.name,
                email: foundUser.email,
                jwt,
            });
        } else {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Invalid login credentials" });
        }
    } catch (err) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }
});

router.put("/changeName", async (req, res) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection = db.collection(USER_COLLECTION_NAME);

        let { newName } = req.body;

        if (!newName) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        const result = await userCollection.updateOne({ _id: userId }, { $set: { name: newName } });

        if (result.modifiedCount === 1) {
            res.status(STATUS_OK).json({ message: "Name updated successfully", jwt: res.locals.refreshedJWT });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update name" });
        }
    } catch (err) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    }
});

router.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);

        const foundEmail = userCollection.findOne({ email });
        if (!foundEmail) {
            res.status(STATUS_BAD_REQUEST).send("No email found in the database.");
            return;
        }

        await resetPasswordEmail(email);
        res.status(STATUS_OK);
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});

// TODO: move to tripCRUD
router.post("/joinTrip", async (req, res, next) => {
    const { inviteCode } = req.body;

    // check incoming params
    if (inviteCode) {
        res.status(STATUS_BAD_REQUEST).json({ error: "inviteCode required" });
        return;
    }

    const userId = extractUserId(res.locals.refreshedJWT);
    if (!userId) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
        return;
    }

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // query the trip with this invite code (unique per trip)
        const trip = await tripCol.findOne({ inviteCode });
        if (!trip) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid invite code" });
            return;
        }

        // prevent joining the same trip twice - technically not an error
        if (trip.memberIds.some((x) => x.equals(userId))) {
            res.status(STATUS_OK).json({ message: "Success (already a member of the trip)", jwt: res.locals.refreshedJWT });
            return;
        }

        // if found, add this user to the trip
        await tripCol.updateOne({ _id: trip._id }, { $push: { memberIds: userId } });
        res.status(STATUS_OK).json({ message: "Successfully joined the trip" });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});

// note that, due to how the create JWT code is hardcoded to only work for user login sessions, the authentication middleware can't be used for this route/endpoint; accordingly, the jwt gets checked with isExpired
router.post("/resetPassword", async (req, res) => {
    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);

        const { newPassword, jwt } = req.body;
        if (!newPassword || !jwt) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        if (isExpired(jwt)) {
            res.status(STATUS_UNAUTHENTICATED).send("Reset code has expired");
            return;
        }

        const userId = extractUserId(jwt);
        const hashedPassword = extract("hashedPassword", jwt);
        if (!userId || !hashedPassword) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        const user = await userCollection.findOne({ _id: userId });
        if (!user) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        if (hashedPassword !== md5(user.password)) {
            res.status(STATUS_UNAUTHENTICATED).send("Reset code is no longer valid");
            return;
        }

        const result = await userCollection.updateOne({ _id: userId }, { $set: { password: newPassword } });
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ message: "Successfully reset password" });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update password" });
        }
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
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
                res.status(STATUS_UNAUTHENTICATED).json({ error: "Failed to register user" });
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
            res.status(STATUS_OK).send(`
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
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Failed to register user" });
        }
        return;
    }

    // We get here if verification wasn't successful
    if (!res.headersSent) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Invalid registration token" });
    }
});
