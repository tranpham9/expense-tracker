/* common.ts
 *
 * Common utilities, types, constants, and functions for the API.
 */

import { Collection, MongoClient, ObjectId } from "mongodb";

export const DB_NAME = "appData";
export const USER_COLLECTION_NAME = "User";
export const EXPENSE_COLLECTION_NAME = "Expense";
export const TRIP_COLLECTION_NAME = "Trip";

/* Homepage constant */
export const HOMEPAGE = "https://accountability-190955e8b06f.herokuapp.com";

/*
 * Get an open connection to the Mongo database. The caller should
 * close() the returned MongoClient object.
 */
export async function getMongoClient(): Promise<MongoClient> {
    let client: MongoClient;
    let uri: string;

    uri = process.env.MONGODB_URI!;
    if (uri === null) {
        throw new Error("MONGODB_URI environment variable not defined");
    }

    client = new MongoClient(uri);
    await client.connect();
    return client;
}

/*
 * The following types are the schema of the underlying objects in the database.
 */

export type User = {
    name: string;
    email: string;
    password: string;
    trips: ObjectId[];
};

export type Expense = {
    name: string;
    tripId: ObjectId;
    description: string;
    cost: string;
    memberIds: ObjectId[];
    payerId: ObjectId;
};

export type Trip = {
    name: string;
    notes: string;
    memberIds: ObjectId[];
    leaderId: ObjectId;
    inviteCode: string;
};
