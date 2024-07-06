import express, { Router } from "express";
import { Collection, MongoClient, ObjectId } from "mongodb";

export const router = express.Router();

const client = new MongoClient(process.env.MONGODB_URI!);
const database = 'appData';

/* TODO - these were taken from server.ts,
  we might need to refactor common types in their own file*/
type User = {
    name: string;
    email: string;
    password: string;
    trips: ObjectId[];
};

type Trip = {
    name: string;
    notes: string;
    memberIds: ObjectId[];
    leaderId: ObjectId;
};

// Middleware function with no mount path that gets executed for every request
// to the router. Use for this that always need to happen, such as verify JWT.
router.use((req, res, next) => {
    
    // For debugging, you can remove it if we don't need it
    console.log(`Incoming connection from ${req.socket.remoteAddress} => ${req.method} ${req.url}`);

    // TODO: JWT validation goes here or anything else we might need.

    if(false /*change me*/) {
        res.statusCode = 401; // 401 Unauthorized
        res.json({ error: "Invalid JWT"});
        return; // missing next() = terminates the response-request cycle
    }

    next(); // All okay, continue with the next handler in the router stack
});

// (All paths are relative to the router's mount path in server.ts)

// Get the trips the user is part of - either as owner or member
router.post('/getTripsForUser', async (req, res, next) => {
    const uid = new ObjectId(req.body.userId);

    try {
        await client.connect();
        const db = client.db(database);
        const collection = db.collection('Trip');
        const results = collection.find({ $or: [ { memberIds: uid }, { leaderId: uid } ] });

        let response = [];
        for await (let result of results) {
            response.push(result._id);
        }
        res.json(response);
    } finally {
        await client.close();
    }
    next();
});

// Get the trips where a user is exclusively the owner/leader
router.post('/getTripsOwnedByUser', async (req, res, next) => {
    const uid = new ObjectId(req.body.userId);

    try {
        await client.connect();
        const db = client.db(database);
        const collection = db.collection('Trip');
        const results = collection.find({ leaderId: uid });

        let response = [];
        for await (let result of results) {
            response.push(result._id);
        }
        res.json(response);
    } finally {
        await client.close();
    }
    next();
});

// Get the full information about a trip
router.post('/getTripInfo', async (req, res, next) => {
    const tid = new ObjectId(req.body.tripId);

    try {
        await client.connect();
        const db = client.db(database);
        const tripCol = db.collection('Trip');
        const expenseCol = db.collection('Expense');
        const userCol = db.collection('User');

        // Get the trip requested
        const result = await tripCol.findOne({ _id: tid });
        if(result === null) {
            res.statusCode = 400;
            res.json({error: "tripId not found"});
            return;
        }

        // To help the frontend, aggregate all the information neccesary
        // about the trip members and expenses.

        // There may be a way to group everything by a single mongo query,
        // but here we'll just construct it manually.

        // Get all the expenses related to this trip
        result.allExpenses = (await expenseCol.find({tripId: tid}).toArray());
        // Get all the information for users in this trip
        result.allMembers = await userCol.find({ _id: { $in: result.memberIds } }).toArray();
        
        // We can add some "bussiness logic" if we wanted to, like a sum of all the costs
        // or something like that

        res.json(result);
    } finally {
        await client.close();
    }
    next();
});

// Create a new, empty trip that belongs to the passed userId
router.post('/createTrip', async (req, res, next) => {
    const uid = new ObjectId(req.body.userId);

    const theTrip: Trip = {
        name: req.body.name,
        notes: req.body.notes,
        memberIds: [],
        leaderId: uid
    };

    try {
        await client.connect();
        const db = client.db(database);
        const tripCol: Collection<Trip> = db.collection('Trip');
        const userCol: Collection<User> = db.collection('User');

        const found = await userCol.findOne({_id: uid});
        if(found === null) {
            res.statusCode = 400;
            res.json({error: "userId not found"});
            return;
        }

        // Insert the trip
        let x = await tripCol.insertOne(theTrip);

        // And update the user object
        // NOTE: do we really need this? The trips already have a "leaderId" field,
        // which is the one used by the rest of the api functions.
        await userCol.updateOne({_id: uid}, { $push: { trips: x.insertedId }});

        // Return the tripId
        res.json({tripId: x.insertedId});
    } finally {
        await client.close();
    }
    next();
});

/*
 * TODO Add Expense to Trip, Add Member to Trip
 * Are we going to implement modify? (Change name, description, cost, etc) ??
 */
