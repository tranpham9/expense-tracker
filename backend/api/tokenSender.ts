// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { createToken } from "./createJWT";
import { ObjectId } from "mongodb";
import { error } from "console";

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

export function createEmail(userId: ObjectId, name: string, email: string) {
    const token = createToken(userId, name, email);

    const mailConfigurations = {
        // It should be a string of sender/server email
        from: "cop4331.donotreply@gmail.com",

        to: email,

        // Subject of Email
        subject: "Email Verification",

        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               https://accountability-190955e8b06f.herokuapp.com/api/verify/${token}
               http://localhost:5000/api/verify/${token} 
               Thanks`,
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        console.error("Error sending email", error)
        console.log("Email Sent Successfully");
        console.log(info);
    });
}
