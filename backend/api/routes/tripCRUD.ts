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
    User,
    USER_COLLECTION_NAME,
    Expense,
    EXPENSE_COLLECTION_NAME,
} from "./common";
import { Collection, MongoClient, ObjectId } from "mongodb";
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
 * Creates a new empty Trip, with the name, notes, and leaderId provided.
 */
router.post("/create", async (req, res, next) => {
    let { name, notes } = req.body;
    // default values for non-required fields
    notes ??= "";

    if (!name) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Malformed Request" });
        return;
    }

    const userId = extractUserId(res.locals.refreshedJWT);
    if (!userId) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
        return;
    }

    let client: MongoClient | undefined;
    try {
        client = await getMongoClient();

        const db = client.db(DB_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // randomly generated permanent invite code for this trip
        let inviteCode: string | undefined;
        // ensure such code does not already exist for another trip (unlikely but might as well check)
        while (!inviteCode || tripCol.findOne({ inviteCode })) {
            // 000000 to 999999 as string padded with zeroes
            const generated = Math.floor(Math.random() * 1000000);
            inviteCode = generated.toString().padStart(6, "0");
        }

        const result = await tripCol.insertOne({
            name,
            notes,
            memberIds: [],
            leaderId: userId,
            inviteCode: inviteCode,
        });

        res.json({
            tripId: result.insertedId,
            jwt: res.locals.refreshedJWT,
        });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Read Information from a Trip, aggregates related expenses and members.
 */
router.post("/get", async (req, res, next) => {
    let client: MongoClient | undefined;
    try {
        // tripId is required
        if (!req.body.tripId) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "tripId required" });
            return;
        }
        const tripId = ObjectId.createFromHexString(req.body.tripId);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // Get the trip requested
        const trip: any = await tripCol.findOne({ _id: tripId });
        if (trip === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "tripId not found" });
            return;
        }

        // To help the frontend, aggregate all the information neccesary
        // about the trip members and expenses.

        // There may be a way to group everything by a single mongo query,
        // but here we'll just construct it manually.

        // Get all the expenses related to this trip
        trip.allExpenses = await expenseCol.find({ tripId: tripId }).toArray();
        // Get all the information for users in this trip
        trip.allMembers = await userCol.find({ _id: { $in: trip.memberIds } }).toArray();

        // We can add some "bussiness logic" if we wanted to, like a sum of all the costs
        // or something like that

        trip.jwt = res.locals.refreshedJWT;
        res.json(trip);
    } finally {
        await client?.close();
    }
});

/*
 * Updates the name, notes of a trip.
 */
router.post("/update", async (req, res, next) => {
    let client: MongoClient | undefined;
    try {
        // tripId is required
        if (!req.body.tripId) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "tripId required" });
            return;
        }
        const tripId = ObjectId.createFromHexString(req.body.tripId);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // verify that trip exists
        if ((await tripCol.findOne({ _id: tripId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "trip does not exist" });
            return;
        }

        // Update the fields if they were provided in the request
        if (req.body.name) {
            await tripCol.updateOne({ _id: tripId }, { $set: { name: req.body.name } });
        }
        if (req.body.notes) {
            await tripCol.updateOne({ _id: tripId }, { $set: { notes: req.body.notes } });
        }

        // Return the tripId
        res.json({
            tripId: tripId,
            jwt: res.locals.refreshedJWT,
        });
    } finally {
        await client?.close();
    }
});

/*
 * Deletes a trip and all associated expenses.
 */
router.post("/delete", async (req, res, next) => {
    let client: MongoClient | undefined;
    try {
        // tripId is required
        if (!req.body.tripId) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "tripId required" });
            return;
        }
        const tripId = ObjectId.createFromHexString(req.body.tripId);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // verify that trip exists
        if ((await tripCol.findOne({ _id: tripId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "trip does not exist" });
            return;
        }

        // Remove this trip from the leader user's `trips` field
        const leaderId = (await tripCol.findOne({ _id: tripId }))?.leaderId;
        await userCol.updateOne({ _id: leaderId }, { $pull: { trips: tripId } });

        // Delete this trip, and all associated expenses
        await tripCol.deleteOne({ _id: tripId });
        await expenseCol.deleteMany({ tripId: tripId });

        res.json({ jwt: res.locals.refreshedJWT });
    } finally {
        await client?.close();
    }
});

/*
 * List all the trips a user is as a member of (as non-owner only).
 */
router.post("/listMemberOf", async (req, res, next) => {
    let client: MongoClient | undefined;
    try {
        // userId is required
        const userId = extractUserId(res.locals.refreshedJWT);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // verify that user exists
        if ((await userCol.findOne({ _id: userId as ObjectId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "user does not exist" });
            return;
        }

        // Return a list that this of trip ids (only include id + trip name)
        res.json({
            trips: await tripCol
                .find({ memberIds: userId as ObjectId })
                .project({ name: 1, notes: 1 })
                .toArray(),
            jwt: res.locals.refreshedJWT,
        });
    } finally {
        await client?.close();
    }
});

/*
 * List all the trips that belong to a user. (As Owner/Leader)
 */
router.post("/listOwnerOf", async (req, res, next) => {
    let client: MongoClient | undefined;
    try {
        // userId is required
        const userId = extractUserId(res.locals.refreshedJWT);

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // verify that user exists
        if ((await userCol.findOne({ _id: userId as ObjectId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "user does not exist" });
            return;
        }

        // Return a list that this of trip ids (only include id + trip name + notes)
        res.json({
            trips: await tripCol
                .find({ leaderId: userId as ObjectId })
                .project({ name: 1, notes: 1 })
                .toArray(),
            jwt: res.locals.refreshedJWT,
        });
    } finally {
        await client?.close();
    }
});

router.post("/join", async (req, res, next) => {
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
        res.status(STATUS_OK).json({ message: "Successfully joined the trip", jwt: res.locals.refreshedJWT });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

// NOTE: this will need to remove the user from the trip and from all expenses (this might get a bit difficult with the payer field of expenses, so maybe we don't want to allow leaving?)
router.post("/leave", async (req, res, next) => {
    // TODO: impl
    res.status(STATUS_OK).json({ message: "not implemented yet" });
});

router.post("/search", async (req, res, next) => {
    let { query, page } = req.body;
    query ??= "";
    const pageNumber = page?.toString() || 1;

    const userId = extractUserId(res.locals.refreshedJWT);
    if (!userId) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
        return;
    }

    let client: MongoClient | undefined;
    try {
        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection(TRIP_COLLECTION_NAME);

        // https://www.mongodb.com/docs/manual/tutorial/query-arrays/#query-an-array-for-an-element
        // TODO: might want to search for exact phrase instead ( https://www.mongodb.com/docs/manual/reference/operator/query/text/#definition )
        const trips = await tripCollection.find(
            {
                $or: [
                    //[wrap]
                    { leaderId: userId },
                    { memberIds: userId },
                ],
                $text: { $search: query },
            },
            // if needed, can add "projection: {<field_name>: 1}" within options to isolate specific fields
            { skip: (pageNumber - 1) * 10, limit: 10 }
        );

        res.status(STATUS_OK).json({ trips, jwt: res.locals.refreshedJWT });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});
