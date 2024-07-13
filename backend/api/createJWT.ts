import "dotenv/config";
import { sign, verify, decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";

//Create a token based on the name, email and password
export function createToken(userId: ObjectId, name: string, email: string, expire: string) {
    let ret;
    try {
        const user = { name, email, userId };
        //Sign the token based on user credentials

        ret = sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: expire });
    } catch (e) {
        ret = { Error: (e as Error).message };
    }
    return ret;
}
//If the JWT has expired, kick the user off
export function isExpired(token: string) {
    // TODO: is a custom verify callback even needed here?
    return verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, verifiedJwt) => !!err);
}
//Each time a valid operation has taken place refresh and get a new JWT
export function refresh(token: string) {
    let ud = decode(token, { complete: true });
    let expire = "20 minutes";
    // TODO: return whatever would be "correct" to return here if the decode fails
    if (!ud) {
        return null;
    }
    //Grab the user information and use it to refresh the token
    //TODO:  Change this here to get the fields that we pass
    // @ts-ignore
    let userId = ud.payload.userId;
    // @ts-ignore
    let name = ud.payload.name;
    // @ts-ignore
    let email = ud.payload.email;

    return createToken(userId, name, email, expire);
}
