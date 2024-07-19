import express from "express";
import {
    DB_NAME,
    getMongoClient,
    STATUS_BAD_REQUEST,
    STATUS_INTERNAL_SERVER_ERROR,
    STATUS_OK,
    STATUS_UNAUTHENTICATED,
    Trip,
    TRIP_COLLECTION_NAME,
    Expense,
    EXPENSE_COLLECTION_NAME,
    STATUS_NOT_IMPLEMENTED,
} from "./common";
import { MongoClient, ObjectId } from "mongodb";
import { authenticationRouteHandler, extractUserId } from "../JWT";

export const router = express.Router();

const AUTHENTICATED_ROUTES = ["/*"];

// JWT Verification
router.use(AUTHENTICATED_ROUTES, authenticationRouteHandler);
// TODO: need to ensure all the endpoints here are properly sending the refreshed JWT, etc.

/*
 * ============================
 * CRUD OPEREATIONS FOR TRIPS
 * ============================
 */

/*
 * Creates a new empty Trip, with the name, description, and leaderId provided.
 */
router.post("/create", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { description } = req.body;
        // default values for non-required fields
        description ??= "";

        const { name } = req.body;
        if (!name) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();

        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        // randomly generated permanent invite code for this trip
        let inviteCode: string | undefined;
        // ensure such code does not already exist for another trip (unlikely but might as well check)
        while (!inviteCode || (await tripCollection.findOne({ inviteCode }))) {
            // 000000 to 999999 as string padded with zeroes
            const generated = Math.floor(Math.random() * 1000000);
            inviteCode = generated.toString().padStart(6, "0");
        }

        const result = await tripCollection.insertOne({
            name,
            description,
            memberIds: [],
            leaderId: userId,
            inviteCode: inviteCode,
        });

        res.status(STATUS_OK).json({
            tripId: result.insertedId,
            jwt: res.locals.refreshedJWT,
        });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Updates the name + description of a trip.
 */
router.post("/update", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { name, description } = req.body;

        let { tripId } = req.body;
        if (!tripId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        tripId = ObjectId.createFromHexString(tripId);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        const result = await tripCollection.updateOne(
            { _id: tripId, leaderId: userId },
            // only update values passed in as params
            {
                $set: {
                    ...(name && { name }),
                    ...(description && { description }),
                },
            }
        );
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update trip" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Deletes a trip and all associated expenses.
 */
router.post("/delete", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { tripId } = req.body;
        if (!tripId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        tripId = ObjectId.createFromHexString(tripId);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);

        // only delete trip if user is leader
        const result = await tripCollection.deleteOne({
            _id: tripId,
            leaderId: userId,
        });
        if (!result.acknowledged) {
            // user can't delete this trip ("invalid" since it might not be a trip that they should "know" of)
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid trip" });
            return;
        }

        // cascade the deletion (at this point, the user was able to successfully delete the trip, so all the corresponding expenses should get expunged)
        // no need to await since it's possible for there to be no corresponding expenses for the trip (in which case the deletion wouldn't get acknowledged, i.e. the deletion count would be 0)
        expenseCollection.deleteMany({ tripId });

        res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

router.post("/join", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) {
            res.status(STATUS_BAD_REQUEST).json({ error: "inviteCode required" });
            return;
        }

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        const result = await tripCollection.updateOne(
            // can't be the leader
            { inviteCode, leaderId: { $ne: userId } },
            // only add if not already in list
            { $addToSet: { memberIds: userId } }
        );
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
        } else {
            // either the invite code doesn't exist or the user is not someone who can join the invite code (i.e. they are the leader or already a part of the trip), so it's an invalid code for them
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid invite code" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

// NOTE: this will need to remove the user from the trip and from all expenses (this might get a bit difficult with the payer field of expenses, so maybe we don't want to allow leaving?)
router.post("/leave", async (req, res) => {
    // TODO: impl
    res.status(STATUS_NOT_IMPLEMENTED).json({ message: "not implemented yet" });
});

router.post("/search", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { page } = req.body;
        const pageNumber = Math.max(parseInt(page?.toString()) || 1, 1); // ensure number is always >= 1

        let { query } = req.body;
        query ??= "";

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);
        // await tripCollection.createIndex({ name: "text", description: "text" });
        /*
        await tripCollection.createSearchIndex({
            // name: "searchIndex",
            definition: {
                mappings: {
                    // dynamic: true,
                    fields: {
                        name: {
                            type: "string",
                        },
                        description: {
                            type: "string",
                        },
                    },
                },
            },
        });
        */

        // https://www.mongodb.com/docs/manual/tutorial/query-arrays/#query-an-array-for-an-element
        // TODO: might want to search for exact phrase instead ( https://www.mongodb.com/docs/manual/reference/operator/query/text/#definition )
        const trips = await tripCollection
            .aggregate([
                {
                    $match: {
                        $or: [
                            //[wrap]
                            { leaderId: userId },
                            { memberIds: userId },
                        ],
                    },
                },
                {
                    $search: {
                        index: "searchIndex",
                        autocomplete: {
                            query,
                            tokenOrder: "any",
                            fuzzy: {
                                maxEdits: 2,
                                prefixLength: 1,
                                maxExpansions: 256,
                            },
                        },
                    },
                },
                {
                    $skip: (pageNumber - 1) * 10,
                },
                {
                    $limit: 10,
                },
            ])
            .toArray();
        /*
        const trips = await tripCollection
            .find(
                {
                    $or: [
                        //[wrap]
                        { leaderId: userId },
                        { memberIds: userId },
                    ],
                    // $text: { $search: query },
                    $search: {
                        query,
                    },
                },
                // if needed, can add "projection: {<field_name>: 1}" within options to isolate specific fields
                { skip: (pageNumber - 1) * 10, limit: 10 }
            )
            .toArray();
        */

        res.status(STATUS_OK).json({ trips, jwt: res.locals.refreshedJWT });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

// NOTE: this is in tripCRUD since we are listing the expenses for a particular trip ("/api/trip/listExpenses" makes the most sense)
router.post("/listExpenses", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { tripId } = req.body;
        if (!tripId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        tripId = ObjectId.createFromHexString(tripId);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);

        // https://www.mongodb.com/docs/manual/tutorial/query-arrays/#query-an-array-for-an-element
        const trip = await tripCollection.findOne({
            _id: tripId,
            $or: [
                //[wrap]
                { leaderId: userId },
                { memberIds: userId },
            ],
        });
        if (!trip) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid trip" });
            return;
        }

        const expenses = await expenseCollection.find({ tripId }).toArray();

        res.status(STATUS_OK).json({ expenses, jwt: res.locals.refreshedJWT });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});
