// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { createJWT } from "./JWT";
import { ObjectId, Collection } from "mongodb";
import { error } from "console";
import { DB_NAME, formatEmail, getMongoClient, HOMEPAGE, User, USER_COLLECTION_NAME } from "./routes/common";
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

// there isn't a good way to "verify" that an email successfully sent (so nothing needs to be returned from thie function)
export function sendVerifyEmail(user: User) {
    const uuid = crypto.randomUUID();

    unverified.set(uuid, user);

    const url = HOMEPAGE + "/api/verify";
    // NOTE: only use this for testing locally (try not to commit with it uncommented)
    // const url = "http://localhost:5000/api/verify/";

    transporter.sendMail(
        {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Email Verification",
            text: `Your email has recently been used to register an account for Accountability.
To verify your account, please use the following link:
    ${url}/${uuid}`,
        },
        (error, info) => {
            if (error) {
                console.error("Error sending email", error);
            } else {
                console.log("Email Sent Successfully");
            }

            console.log(info);
        }
    );
}

export async function resetPasswordEmail(email: string) {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const userCollection: Collection<User> = db.collection(USER_COLLECTION_NAME);

    // standardize the format of emails
    const properEmail = formatEmail(email);

    // acquire the user information to create a jwt
    const result = await userCollection.findOne({ email: properEmail });
    const expire = "5m";
    const jwt = "";

    if (result) {
        const { _id, name, email } = result;
        const hashedPassword = md5(result.password);
        const jwt = sign({ _id, name, email, hashedPassword }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: expire });
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
        ${url}/${jwt}\n\n
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
