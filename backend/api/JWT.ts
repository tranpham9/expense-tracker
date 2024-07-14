import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import { sign, verify, decode, JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { STATUS_BAD_REQUEST, STATUS_NOT_FOUND, STATUS_UNAUTHENTICATED } from "./routes/common";

// create a token based on the name, email and password
export function createJWT(userId: ObjectId, email: string) {
    try {
        const user = { email, userId };
        //Sign the token based on user credentials
        return sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
    } catch (e) {
        // TODO: might want to just return null
        return { error: (e as Error).message };
    }
}

export function isExpired(token: string): boolean {
    try {
        verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return false; // Token is valid
    } catch (TokenExpiredError) {
        return true; // Token has expired
    }
}

// refresh a valid jwt
export function refresh(jwt: string) {
    if (isExpired(jwt)) {
        return null;
    }

    const decodedJWT = decode(jwt, { complete: true });
    if (!decodedJWT) {
        return null;
    }

    // grab the user information and use it to refresh the token

    // TODO: does userId need to be converted to an ObjectId?
    // @ts-ignore
    let userId = decodedJWT.payload.userId;
    // @ts-ignore
    let email = decodedJWT.payload.email;

    return createJWT(userId, email);
}

export function extractUserId(jwt: string) {
    const decodedJWT = decode(jwt, { complete: true });
    if (!decodedJWT) {
        return null;
    }

    return ObjectId.createFromHexString((decodedJWT.payload as JwtPayload).userId as string);
}

export const authenticationRouteHandler = (req: Request, res: Response, next: NextFunction) => {
    const { jwt } = req.body;
    if (!jwt) {
        res.status(STATUS_BAD_REQUEST).json({ error: "Authentication (JWT) required" });
        return;
    }

    const refreshedJWT = refresh(jwt);
    if (!refreshedJWT) {
        res.status(STATUS_UNAUTHENTICATED).json({ error: "Session Expired" });
        return;
    }

    // keep track of new JWT
    res.locals.refreshedJWT = refreshedJWT;

    /* Then only adding this to each route's response is needed:
        req.json({
        ...
        token: res.locals.refreshedToken
        });
     */
    next(); // continue processing this request
};
