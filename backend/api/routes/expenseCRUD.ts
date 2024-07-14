import express from "express";
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, STATUS_BAD_REQUEST, STATUS_INTERNAL_SERVER_ERROR, STATUS_OK, STATUS_UNAUTHENTICATED, Trip, TRIP_COLLECTION_NAME } from "./common";
import { Collection, ObjectId } from "mongodb";
import { authenticationRouteHandler, extractUserId, refresh } from "../JWT";

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
router.post("/create", async (req, res, next) => {
    let { tripId, name, cost, description } = req.body;
    description ??= ""; // description not required

    if (!tripId || !name || !cost) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Malformed Request" });
        return;
    }

    const userId = extractUserId(res.locals.refreshedToken);
    if (!userId) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Malformed JWT" });
        return;
    }

    tripId = ObjectId.createFromHexString(tripId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);

        // verify that trip exists
        if ((await tripCol.findOne({ _id: tripId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "trip does not exist" });
            return;
        }

        const result = await expenseCol.insertOne({
            tripId,
            payerId: userId,
            /* TODO: we'll implement expense splitting later */
            memberIds: [],
            name,
            cost,
            description,
        });

        // return the expense id
        res.status(STATUS_OK).json({ expenseId: result.insertedId, jwt: res.locals.refreshedToken });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});

/*
 * Read an expense. Note that this can also be done with /trips/readTrip which
 * will return all the expenses for a single trip.
 */
router.post("/get", async (req, res, next) => {
    const { expenseId } = req.body;

    // expenseId is required
    if (!expenseId) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
        return;
    }

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        const expense = await expenseCol.findOne({ _id: ObjectId.createFromHexString(expenseId) });
        res.status(STATUS_OK).json({ ...expense, jwt: res.locals.refreshedToken });
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});

/*
 * Updates the name, notes, cost of an expense
 */
router.post("/update", async (req, res, next) => {
    const { expenseId, name, description, notes, cost, memberIds } = req.body;
    if (!expenseId || (memberIds && !(memberIds instanceof Array))) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Malformed request" });
        return;
    }

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);

        // verify that expense exists
        if ((await expenseCol.findOne({ _id: expenseId })) === null) {
            res.statusCode = STATUS_BAD_REQUEST;
            res.json({ error: "expense does not exist" });
            return;
        }

        const result = await expenseCol.updateOne(
            { _id: expenseId },
            // only update values passed in as params
            {
                ...(name && { name }),
                ...(description && { description }),
                // expenses don't have notes
                // ...(notes && { notes }),
                ...(cost && { cost }),
                ...(memberIds && { memberIds }),
            }
        );
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ token: res.locals.refreshedToken });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to update expense" });
        }
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});

/*
 * Delete an expense
 */
router.post("/delete", async (req, res, next) => {
    const { expenseId } = req.body;
    if (!expenseId) {
        res.status(STATUS_BAD_REQUEST).json({ error: "expenseId required" });
        return;
    }

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);

        const result = await expenseCol.deleteOne({ _id: expenseId });
        if (result.acknowledged) {
            res.status(STATUS_OK).json({ token: res.locals.refreshedToken });
        } else {
            res.status(STATUS_BAD_REQUEST).json({ error: "Failed to delete expense" });
        }
    } catch (error) {
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
    } finally {
        await client.close();
    }
});
