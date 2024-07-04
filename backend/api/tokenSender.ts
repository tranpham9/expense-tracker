// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { createToken } from "./createJWT";
import { EphemeralKeyInfo } from "tls";

//TODO: create zoho email address 
const transporter = createTransport({
    service: "smtp.zoho.commtp.zoho.eu",
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

export function createEmail(name: string, email: string, token: Object) {
    if (token == Error){
        return;
    }
    const mailConfigurations = {
        // It should be a string of sender/server email
        from: "insert project email here",

        to: email,

        // Subject of Email
        subject: "Email Verification",

        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               https://accountability-190955e8b06f.herokuapp.com/api/verify/${token} 
               Thanks`,
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error();
        console.log("Email Sent Successfully");
        console.log(info);
    });
}
