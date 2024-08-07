import express from "express";
import { DB_NAME, formatEmail, getMongoClient, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_NOT_FOUND, STATUS_OK, STATUS_UNAUTHENTICATED, User, USER_COLLECTION_NAME } from "./common";
import { MongoClient, ObjectId } from "mongodb";
import { sendVerifyEmail, sendResetPasswordEmail, unverified } from "../email";
import md5 from "md5";
import { authenticationRouteHandler, createJWT, extract, extractUserId, isExpired } from "../JWT";

export const router = express.Router();

const AUTHENTICATED_ROUTES = ["/update", "/get"];

// JWT Verification
router.use(AUTHENTICATED_ROUTES, authenticationRouteHandler);

router.post("/register", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        // TODO: I believe we don't need an optional trip id here anymore?
        const { name, email, password, bio } = req.body;
        if (!name || !email || !password) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        /*if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            res.status(406).json("Must be a valid email");
            return;
    }*/
        const properEmail = formatEmail(email);

        // TODO: ensure trips should also include non-owning trips (i.e. ones where the user is a part of but not the creater/owner of)
        const newUser: User = {
            name: name.toString(),
            email: properEmail,
            password: md5(password.toString()),
            bio: bio || "", // optional
        };

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        // ensure email doesn't already exist
        const check = await userCollection.findOne({ email: properEmail });
        // console.log(check);
        if (check) {
            console.error("Attempted to register a user with an existing email");
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Failed to register user" });
            return;
        }

        sendVerifyEmail(newUser);

        // console.log("A user was registered successfully");
        res.status(STATUS_OK).json({ message: "Successfully sent register verification email" });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.post("/login", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        const properEmail = formatEmail(email);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        const hashedPassword = md5(password);

        const foundUser = await userCollection.findOne({ email: properEmail });
        if (foundUser && hashedPassword === foundUser.password) {
            const jwt = createJWT(foundUser._id, foundUser.email);
            res.status(STATUS_OK).json({
                userId: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                bio: foundUser.bio,
                jwt,
            });
        } else {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Invalid login credentials" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.post("/get", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        // (This is the userId of the user to look up for, not the logged in user)
        const { userId } = req.body;
        if (!userId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "userId required" });
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        const result = await userCollection.findOne({ _id: ObjectId.createFromHexString(userId) });
        if (!result) {
            res.status(STATUS_NOT_FOUND).json({ error: "userId not found" });
            return;
        }

        // be cautious of not sending back the while object with the password hash
        res.status(STATUS_OK).json({
            _id: result._id,
            name: result.name,
            email: result.email,
            bio: result.bio,
            jwt: res.locals.refreshedJWT,
        });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.post("/update", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { name, bio } = req.body;

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        await userCollection.updateOne(
            { _id: userId },
            // only update values passed in as params
            {
                $set: {
                    ...(name && { name }),
                    ...(bio && { bio }),
                },
            }
        );
        // it isn't guaranteed that anything will be modified, so we just return STATUS_OK uncodnitionally
        res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.post("/forgotPassword", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { email } = req.body;
        if (!email) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        const properEmail = formatEmail(email);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        const user = await userCollection.findOne({ email: properEmail });
        if (!user) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid email" });
            return;
        }

        sendResetPasswordEmail(user);

        res.status(STATUS_OK).json({ message: "Successfully sent reset password email" });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

// note that, due to how the create JWT code is hardcoded to only work for user login sessions, the authentication middleware can't be used for this route/endpoint; accordingly, the jwt gets checked with isExpired
router.post("/resetPassword", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { newPassword } = req.body;
        const { jwt } = req.body;
        if (!newPassword || !jwt) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        newPassword = md5(newPassword);

        if (isExpired(jwt)) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Reset code has expired" });
            return;
        }

        const userId = extractUserId(jwt);
        const oldHashedPassword = extract("hashedPassword", jwt);
        if (!userId || !oldHashedPassword) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        const user = await userCollection.findOne({ _id: userId });
        if (!user) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        if (oldHashedPassword !== md5(user.password)) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Reset code is no longer valid" });
            return;
        }

        const result = await userCollection.updateOne({ _id: userId }, { $set: { password: newPassword } });
        if (result.acknowledged && result.matchedCount) {
            res.status(STATUS_OK).json({ message: "Successfully reset password" });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update password" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.get("/verify/:token", async (req, res) => {
    // creates html for the respective message
    const getHTMLTemplate = (message: string, shouldRedirect = false) => {
        return `<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />${
            shouldRedirect
                ? `
        <meta http-equiv="refresh" content="5; url=/" />`
                : ""
        }
    </head>
    <body>
        <h3>${message}</h3>
    </body>
</html>`;
    };

    let client: MongoClient | undefined;
    try {
        // get User document from token
        const { token } = req.params;
        const verified = unverified.get(token);
        if (!verified) {
            res.status(STATUS_BAD_REQUEST).send(getHTMLTemplate("Verification failed; invalid verification code."));
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const userCollection = db.collection<User>(USER_COLLECTION_NAME);

        // insert new user
        const result = await userCollection.insertOne(verified);
        if (!result.acknowledged || !result.insertedId) {
            res.status(STATUS_BAD_REQUEST).send(getHTMLTemplate("Failed to register user."));
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
        res.status(STATUS_OK).send(getHTMLTemplate("Verification successful. Redirecting to website in 5 seconds.", true));

        /*// if tripId is provided, add user to trip
            if (verified?.trips) {
                // use createFromHexString ( https://github.com/dotansimha/graphql-code-generator/issues/6830#issuecomment-2105266455 )
                // TODO: might need to handle this failing?  Would need to check .acknowledged boolean
                await tripCollection.updateOne({ _id: ObjectId.createFromHexString(tripId) }, { $push: { memberIds: insertionResult.insertedId } });
            }*/
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).send(getHTMLTemplate("Something went wrong."));
    } finally {
        await client?.close();
    }
});
