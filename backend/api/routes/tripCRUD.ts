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
    let client: MongoClient | undefined;
    try {
        // leaderId is required, that's the user that will own this new trip
        const leaderId = extractUserId(res.locals.refreshedJWT);
        if (!leaderId) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "leaderId required" });
            return;
        }

        // Default values for non-required fields
        req.body.name ??= "Unnamed Trip";
        req.body.notes ??= "No notes provided";

        client = await getMongoClient();

        const db = client.db(DB_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // verify that leader user exists
        if ((await userCol.findOne({ _id: leaderId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "leaderId user does not exist" });
            return;
        }

        // randomly generated permanent invite code for this trip
        let inviteCode = null;
        // ensure such code does not already exist for another trip (unlikely but might as well check)
        while (inviteCode == null || !tripCol.findOne({ inviteCode: inviteCode })) {
            // 000000 to 999999 as string padded with zeroes
            let num = Math.floor(Math.random() * 1000000);
            inviteCode = String(num).padStart(6, "0");
        }

        const result = await tripCol.insertOne({
            name: req.body.name,
            notes: req.body.notes,
            memberIds: [],
            leaderId: leaderId,
            inviteCode: inviteCode,
        });

        // And update the user object
        // NOTE: do we really need this? The trips already have a "leaderId" field,
        // which is the one used by the rest of the api functions.
        // await userCol.updateOne({ _id: leaderId }, { $push: { trips: result.insertedId } });

        // Return the tripId
        res.json({
            tripId: result.insertedId,
            jwt: res.locals.refreshedJWT,
        });
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
