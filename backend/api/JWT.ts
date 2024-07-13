import "dotenv/config";
import { sign, verify, decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";

//Create a token based on the name, email and password
export function createJWT(userId: ObjectId, name: string, email: string) {
    try {
        const user = { name, email, userId };
        //Sign the token based on user credentials
        return sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
    } catch (e) {
        return { Error: (e as Error).message };
    }
}
//If the JWT has expired, kick the user off
export function isExpired(token: string): boolean {
    try {
        verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return false; // Token is valid
    } catch (TokenExpiredError) {
        return true; // Token has expired
    }
}

//Each time a valid operation has taken place refresh and get a new JWT
export function refresh(token: string) {
    let decodedJWT = decode(token, { complete: true });
    // TODO: return whatever would be "correct" to return here if the decode fails
    if (!decodedJWT) {
        return null;
    }
    //Grab the user information and use it to refresh the token
    //TODO:  Change this here to get the fields that we pass
    // @ts-ignore
    let userId = decodedJWT.payload.userId;
    // @ts-ignore
    let name = decodedJWT.payload.name;
    // @ts-ignore
    let email = decodedJWT.payload.email;

    return createJWT(userId, name, email);
}
