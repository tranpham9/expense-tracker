// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { createJWT } from "./JWT";
import { ObjectId, Collection } from "mongodb";
import { error } from "console";
import { DB_NAME, getMongoClient, HOMEPAGE, User, USER_COLLECTION_NAME } from "./routes/common";
import { json } from "stream/consumers";
import { JsonWebTokenError, sign } from "jsonwebtoken";
import md5 from "md5";

const transporter = createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

type mailConfigurations = {
    from: string;
    to: string;
    subject: string;
    text: string;
};
export const unverified = new Map<string, User>();
export const resetPasswordMap = new Map<string, string>();

export function createEmail(user: User) {
    // const token = createToken(userId, name, email);

    let uuid = crypto.randomUUID();

    unverified.set(uuid, user);

    //const url = HOMEPAGE + "/api/verify/";
    const url = "http://localhost:5000/api/verify/";

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: process.env.EMAIL,

        to: user.email,

        // Subject of Email
        subject: "Email Verification",

        // This would be the text of email body
        text: `Hi! There, You have recently visited our website and entered your email.\n 
        Please follow the given link to verify your email\n
        ${url}${uuid}
        
        Thanks`,
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.error("Error sending email", error);
        }
        console.log("Email Sent Successfully");
        console.log(info);
    });
    return 200;
}

export async function resetPasswordEmail(email: string) {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);

    // standardize the format of emails
    const properEmail = (email.toString() as string).trim().toLocaleLowerCase();

    // acquire the user information to create a jwt
    const result = await userCollection.findOne({ email });
    const expire = "5m";
    const jwt="";

    if(result){
        const {_id, name, email} = result; 
        const hashPass = md5(result.password);
        const jwt = sign({_id, name, email, hashPass}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: expire});
    }
    
    const url = HOMEPAGE + "/resetPassword";
    //const url = "http://localhost:5000/resetPassword";

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: process.env.EMAIL,

        to: email,

        // Subject of Email
        subject: "Reset Password",

        // This would be the text of email body
        text: `Hi! There, You have recently visited our website and requested to change your password\n 
        Please follow the given link to change your password\n
        ${url}${jwt}\n\n
        Thanks`,
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) {
            console.error("Error sending email", error);
        }
        console.log("Email Sent Successfully");
        console.log(info);
    });
    return 200;
}
