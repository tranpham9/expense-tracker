import express from "express";
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_OK, STATUS_UNAUTHENTICATED, Trip, TRIP_COLLECTION_NAME } from "./common";
import { MongoClient, ObjectId } from "mongodb";
import { authenticationRouteHandler, extractUserId } from "../JWT";

export const router = express.Router();

const AUTHENTICATED_ROUTES = ["/*"];

// JWT Verification
router.use(AUTHENTICATED_ROUTES, authenticationRouteHandler);

/*
 * ============================
 * CRUD OPEREATIONS FOR EXPENSES
 * ============================
 */

// FIXME: currently, I don't think that the user has any way of getting the trip id
// FIXME(2): it needs to be verified that the user is a part of the trip they are trying to add expenses to
/*
 * Create a new expense, that belongs to a trip.
 */
router.post("/create", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        const { name, cost } = req.body;

        let { tripId, memberIds, description } = req.body;
        description ??= ""; // description not required

        // TODO: figure out if cost will come in as a number vs a string
        if (!tripId || !name || (!cost && cost !== 0) || !(memberIds instanceof Array)) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        tripId = ObjectId.createFromHexString(tripId);
        memberIds = memberIds.map(ObjectId.createFromHexString);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);

        // verify tripId is a valid trip the user is a part of
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

        const result = await expenseCollection.insertOne({
            tripId,
            payerId: userId,
            memberIds,
            name,
            cost,
            description,
        });
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ expenseId: result.insertedId, jwt: res.locals.refreshedJWT });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to create expense" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Read an expense. Note that this can also be done with /trips/readTrip which
 * will return all the expenses for a single trip.
 */
router.post("/get", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { expenseId } = req.body;
        if (!expenseId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        expenseId = ObjectId.createFromHexString(expenseId);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();

        const db = client.db(DB_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        const expense = await expenseCollection.findOne({ _id: expenseId });
        if (!expense) {
            // TODO: WRONG
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        // ensure user is part of trip
        const trip = await tripCollection.findOne({
            _id: expense.tripId,
            $or: [
                //[wrap]
                { leaderId: userId },
                { memberIds: userId },
            ],
        });
        if (!trip) {
            // NOTE: this is an invalid expense, not an invalid trip; whatever supposed expense the user is trying to access exists, but it is not one they have access to, so in their eyes it is "invalid"/"doesn't exist"
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        res.status(STATUS_OK).json({ expense, jwt: res.locals.refreshedJWT });
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Updates the name, description, cost of an expense
 */
router.post("/update", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        // NOTE: for now, payer id can't be changed (implementing that might cause some issues; we can add it down the line if we have time [we probaly won't])
        let { expenseId, memberIds } = req.body;
        const { name, description, cost } = req.body;
        if (!expenseId || !(memberIds instanceof Array)) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        expenseId = ObjectId.createFromHexString(expenseId);
        memberIds = memberIds.map(ObjectId.createFromHexString);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        const expense = await expenseCollection.findOne({ _id: expenseId });
        if (!expense) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        // ensure user is part of trip
        const trip = await tripCollection.findOne({
            _id: expense.tripId,
            $or: [
                //[wrap]
                { leaderId: userId },
                { memberIds: userId },
            ],
        });
        if (!trip) {
            // NOTE: this is an invalid expense, not an invalid trip; whatever supposed expense the user is trying to access exists, but it is not one they have access to, so in their eyes it is "invalid"/"doesn't exist"
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        const result = await expenseCollection.updateOne(
            { _id: expenseId },
            // only update values passed in as params
            {
                $set: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(cost && { cost }),
                    ...(memberIds && { memberIds }),
                },
            }
        );
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update expense" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});

/*
 * Delete an expense
 */
router.post("/delete", async (req, res) => {
    let client: MongoClient | undefined;
    try {
        let { expenseId } = req.body;
        if (!expenseId) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
            return;
        }
        expenseId = ObjectId.createFromHexString(expenseId);

        const userId = extractUserId(res.locals.refreshedJWT);
        if (!userId) {
            res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
            return;
        }

        client = await getMongoClient();
        const db = client.db(DB_NAME);
        const expenseCollection = db.collection<Expense>(EXPENSE_COLLECTION_NAME);
        const tripCollection = db.collection<Trip>(TRIP_COLLECTION_NAME);

        const expense = await expenseCollection.findOne({ _id: expenseId });
        if (!expense) {
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        // ensure user is part of trip
        const trip = await tripCollection.findOne({
            _id: expense.tripId,
            $or: [
                //[wrap]
                { leaderId: userId },
                { memberIds: userId },
            ],
        });
        if (!trip) {
            // NOTE: this is an invalid expense, not an invalid trip; whatever supposed expense the user is trying to access exists, but it is not one they have access to, so in their eyes it is "invalid"/"doesn't exist"
            res.status(STATUS_BAD_REQUEST).json({ error: "Invalid expense" });
            return;
        }

        const result = await expenseCollection.deleteOne({ _id: expenseId });
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ jwt: res.locals.refreshedJWT });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to delete expense" });
        }
    } catch (error) {
        console.trace(error);
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client?.close();
    }
});
