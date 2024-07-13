// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { createToken } from "./createJWT";
import { ObjectId } from "mongodb";
import { error } from "console";
import { User } from "./routes/common";
import { json } from "stream/consumers";
import { JsonWebTokenError } from "jsonwebtoken";

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

    //const url = "https://accountability-190955e8b06f.herokuapp.com/api/users/verify/";
    const url = "http://localhost:5000/api/users/verify/";

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: "cop4331.donotreply@gmail.com",

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
export function resetPasswordEmail(email: string){
    let uuid = crypto.randomUUID();

    resetPasswordMap.set(uuid, email);

    //const url = "https://accountability-190955e8b06f.herokuapp.com/api/users/verify/";
    const url = "http://localhost:5000/api/users/resetPassword/";

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: "cop4331.donotreply@gmail.com",

        to: email,

        // Subject of Email
        subject: "Reset Password",

        // This would be the text of email body
        text: `Hi! There, You have recently visited our website and requested to change your password\n 
        Please follow the given link to change your password\n
        ${url}${uuid}\n\n
        \t${uuid}
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
