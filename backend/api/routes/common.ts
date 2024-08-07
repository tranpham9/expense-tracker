/* common.ts
 *
 * Common utilities, types, constants, and functions for the API.
 */

import { MongoClient, ObjectId } from "mongodb";

export const DB_NAME = "appData";
export const USER_COLLECTION_NAME = "User";
export const EXPENSE_COLLECTION_NAME = "Expense";
export const TRIP_COLLECTION_NAME = "Trip";

/* Homepage constant */
export const HOMEPAGE = "https://accountability-190955e8b06f.herokuapp.com";

// status codes
// references: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
/** everything went as planned
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
 */
export const STATUS_OK = 200;
/** malformed json body/etc.
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
 */
export const STATUS_BAD_REQUEST = 400;
/** user isn't properly logged in/authenticated; could be equivalently named STATUS_UNAUTHORIZED
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
 */
export const STATUS_UNAUTHENTICATED = 401;
/** invalid endpoint
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
 */
export const STATUS_NOT_FOUND = 404;
/** internal error/issue which couldn't be handled
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500
 */
export const STATUS_INTERNAL_SERVER_ERROR = 500;
/** not yet implemented/sorted
 *
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501
 */
export const STATUS_NOT_IMPLEMENTED = 501;

/*
 * Get an open connection to the Mongo database. The caller should
 * close() the returned MongoClient object.
 */
export async function getMongoClient() {
    const uri = process.env.MONGODB_URI!;
    if (!uri) {
        throw new Error("MONGODB_URI environment variable not defined");
    }

    const client = new MongoClient(uri);
    return client.connect();
}

/**
 * Standardizes email format for consistency with db
 * @param email the raw email directly from caller of an endpoint; type any is deliberate (makes it easier to utilize this function with fields directly from the user)
 */
export function formatEmail(email: object) {
    return (email.toString() as string).trim().toLocaleLowerCase();
}

/*
 * The following types are the schema of the underlying objects in the database.
 */

export type User = {
    name: string;
    email: string;
    password: string;
    bio: string;
};

export type Trip = {
    name: string;
    description: string;
    inviteCode: string;
    leaderId: ObjectId;
    memberIds: ObjectId[];
};

export type Expense = {
    name: string;
    description: string;
    cost: number;
    tripId: ObjectId;
    payerId: ObjectId;
    memberIds: ObjectId[];
};
