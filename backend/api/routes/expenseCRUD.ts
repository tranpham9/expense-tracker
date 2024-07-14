import express from "express";
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, STATUS_BAD_REQUEST, STATUS_OK, STATUS_UNAUTHENTICATED, Trip, TRIP_COLLECTION_NAME } from "./common";
import { Collection, ObjectId } from "mongodb";
import { extractUserId, refresh } from "../JWT";

export const router = express.Router();

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
    let { tripId, name, cost, description, jwt } = req.body;
    description ??= ""; // description not required

    if (!tripId || !name || !cost || !jwt) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Malformed Request" });
        return;
    }

    jwt = refresh(jwt);
    if (!jwt) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Session Expired" });
        return;
    }

    const userId = extractUserId(jwt);
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
        res.status(STATUS_OK).json({ expenseId: result.insertedId, jwt });
    } finally {
        await client.close();
    }
});

/*
 * Read an expense. Note that this can also be done with /trips/readTrip which
 * will return all the expenses for a single trip.
 */
router.post("/get", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = STATUS_BAD_REQUEST;
        res.json({ error: "expenseId required" });
        return;
    }
    const expenseId = new ObjectId(req.body.expenseId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        let expense: any = await expenseCol.findOne({ _id: expenseId });
        expense.token = res.locals.refreshedToken;
        res.json(expense);
    } finally {
        await client.close();
    }

    next();
});

/*
 * Updates the name, notes, cost of an expense
 */
router.post("/update", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = STATUS_BAD_REQUEST;
        res.json({ error: "expenseId required" });
        return;
    }
    const expenseId = ObjectId.createFromHexString(req.body.expenseId);

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

        // Update the fields if they were provided in the request
        if (req.body.name) {
            await expenseCol.updateOne({ _id: expenseId }, { name: req.body.name });
        }
        if (req.body.description) {
            await expenseCol.updateOne({ _id: expenseId }, { notes: req.body.description });
        }
        if (req.body.cost) {
            await expenseCol.updateOne({ _id: expenseId }, { notes: req.body.cost });
        }

        // Return the tripId
        res.json({
            expenseId: expenseId,
            token: res.locals.refreshedToken,
        });
    } finally {
        await client.close();
    }

    next();
});

/*
 * Delete an expense
 */
router.post("/delete", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = STATUS_BAD_REQUEST;
        res.json({ error: "expenseId required" });
        return;
    }
    const expenseId = new ObjectId(req.body.expenseId);

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

        // Just remove it
        expenseCol.deleteOne({ _id: expenseId });

        res.json({ token: res.locals.refreshedToken });
    } finally {
        await client.close();
    }

    next();
});
