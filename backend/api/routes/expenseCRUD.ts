import express from "express";
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, Trip, TRIP_COLLECTION_NAME, User, USER_COLLECTION_NAME } from "./common";
import { Collection, ObjectId } from "mongodb";

export const router = express.Router();

/*
 * ============================
 * CRUD OPEREATIONS FOR EXPENSES
 * ============================
 */

/*
 * Create a new expense, that belongs to a trip.
 */
router.post("/createExpense", async (req, res, next) => {
    // tripId is required, it's the trip this new expense will belong to
    if (!req.body.tripId) {
        res.statusCode = 400;
        res.json({ error: "tripId required" });
        return;
    }
    const tripId = new ObjectId(req.body.tripId);

    // Default values for non-required fields
    req.body.name ??= "Unnamed Expense";
    req.body.description ??= "No description provided";
    req.body.cost ??= 0;

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);

        // verify that trip exists
        if ((await tripCol.findOne({ _id: tripId })) === null) {
            res.statusCode = 400;
            res.json({ error: "trip does not exist" });
            return;
        }

        const result = await expenseCol.insertOne({
            name: req.body.name,
            description: req.body.description,
            cost: req.body.cost,
            tripId: tripId,
            memberIds: [] /* TODO: we'll implement expense splitting later */,
            payerId: new ObjectId(0),
        });

        // return the expense id
        res.json({ expenseId: result.insertedId });
    } finally {
        await client.close();
    }

    next();
});

/*
 * Read an expense. Note that this can also be done with /trips/readTrip which
 * will return all the expenses for a single trip.
 */
router.post("/readExpense", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = 400;
        res.json({ error: "expenseId required" });
        return;
    }
    const expenseId = new ObjectId(req.body.expenseId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        res.json(await expenseCol.findOne({ _id: expenseId }));
    } finally {
        await client.close();
    }

    next();
});

/*
 * Updates the name, notes, cost of an expense
 */
router.post("/updateExpense", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = 400;
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
            res.statusCode = 400;
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
        res.json({ expenseId: expenseId });
    } finally {
        await client.close();
    }

    next();
});

/*
 * Delete an expense
 */
router.post("/deleteExpense", async (req, res, next) => {
    // expenseId is required
    if (!req.body.expenseId) {
        res.statusCode = 400;
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
            res.statusCode = 400;
            res.json({ error: "expense does not exist" });
            return;
        }

        // Just remove it
        expenseCol.deleteOne({ _id: expenseId });

        // Return empty object
        res.json({});
    } finally {
        await client.close();
    }

    next();
});
