import express from 'express';
import { DB_NAME, Expense, EXPENSE_COLLECTION_NAME, getMongoClient, Trip, TRIP_COLLECTION_NAME, User, USER_COLLECTION_NAME } from './common';
import { Collection, ObjectId } from 'mongodb';

export const router = express.Router();

/*
 * ============================
 * CRUD OPEREATIONS FOR TRIPS
 * ============================
 */

/*
 * Creates a new empty Trip, with the name, notes, and leaderId provided.
 */
router.post('/createTrip', async (req, res, next) => {

    // leaderId is required, that's the user that will own this new trip
    if(!req.body.leaderId) {
        res.statusCode = 400;
        res.json({error: 'leaderId required'});
        return;
    }
    const leaderId = new ObjectId(req.body.leaderId);

    // Default values for non-required fields
    req.body.name ??= 'Unnamed Trip';
    req.body.notes ??= 'No notes provided';

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // verify that leader user exists
        if(await userCol.findOne({_id: leaderId}) === null) {
            res.statusCode = 400;
            res.json({error: 'leaderId user does not exist'});
            return;
        }

        const result = await tripCol.insertOne({
            name: req.body.name,
            notes: req.body.notes,
            memberIds: [],
            leaderId: leaderId
        });

        // And update the user object
        // NOTE: do we really need this? The trips already have a "leaderId" field,
        // which is the one used by the rest of the api functions.
        await userCol.updateOne({_id: leaderId}, { $push: { trips: result.insertedId }});

        // Return the tripId
        res.json({tripId: result.insertedId});
    } finally {
        await client.close();
    }

    next();

});

/*
 * Read Information from a Trip, aggregates related expenses and members.
 */
router.post('/readTrip', async(req, res, next) => {

    // tripId is required
    if(!req.body.tripId) {
        res.statusCode = 400;
        res.json({error: 'tripId required'});
        return;
    }
    const tripId = new ObjectId(req.body.tripId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // Get the trip requested
        const trip: any = await tripCol.findOne({ _id: tripId });
        if(trip === null) {
            res.statusCode = 400;
            res.json({error: "tripId not found"});
            return;
        }

        // To help the frontend, aggregate all the information neccesary
        // about the trip members and expenses.

        // There may be a way to group everything by a single mongo query,
        // but here we'll just construct it manually.

        // Get all the expenses related to this trip
        trip.allExpenses = (await expenseCol.find({tripId: tripId}).toArray());
        // Get all the information for users in this trip
        trip.allMembers = await userCol.find({ _id: { $in: trip.memberIds } }).toArray();
        
        // We can add some "bussiness logic" if we wanted to, like a sum of all the costs
        // or something like that

        res.json(trip);
    } finally {
        await client.close();
    }

    next();

});

/*
 * Updates the name, notes of a trip.
 */
router.post('/updateTrip', async (req, res, next) => {

    // tripId is required
    if(!req.body.tripId) {
        res.statusCode = 400;
        res.json({error: 'tripId required'});
        return;
    }
    const tripId = new ObjectId(req.body.tripId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);

        // verify that trip exists
        if(await tripCol.findOne({_id: tripId}) === null) {
            res.statusCode = 400;
            res.json({error: 'trip does not exist'});
            return;
        }

        // Update the fields if they were provided in the request
        if(req.body.name) {
            await tripCol.updateOne({_id: tripId}, {name: req.body.name});
        }
        if(req.body.notes) {
            await tripCol.updateOne({_id: tripId}, {notes: req.body.notes});
        }

        // Return the tripId
        res.json({tripId: tripId});
    } finally {
       await client.close();
    }

    next();

});

/*
 * Deletes a trip and all associated expenses.
 */
router.post('/deleteTrip', async(req, res, next) => {

    // tripId is required
    if(!req.body.tripId) {
        res.statusCode = 400;
        res.json({error: 'tripId required'});
        return;
    }
    const tripId = new ObjectId(req.body.tripId);

    const client = await getMongoClient();
    try {
        const db = client.db(DB_NAME);
        const tripCol: Collection<Trip> = db.collection(TRIP_COLLECTION_NAME);
        const expenseCol: Collection<Expense> = db.collection(EXPENSE_COLLECTION_NAME);
        const userCol: Collection<User> = db.collection(USER_COLLECTION_NAME);

        // verify that trip exists
        if(await tripCol.findOne({_id: tripId}) === null) {
            res.statusCode = 400;
            res.json({error: 'trip does not exist'});
            return;
        }

        // Remove this trip from the leader user's `trips` field
        const leaderId = (await tripCol.findOne({_id: tripId}))?.leaderId;
        await userCol.updateOne({_id: leaderId}, {$pull: {trips: tripId}});

        // Delete this trip, and all associated expenses
        await tripCol.deleteOne({_id: tripId});
        await expenseCol.deleteMany({tripId: tripId});

        // Return empty object
        res.json({});
    } finally {
       await client.close();
    }
    
    next();
});