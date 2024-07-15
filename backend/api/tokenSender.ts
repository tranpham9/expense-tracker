// filename tokenSender.ts

import { createTransport } from "nodemailer";
import { WithId } from "mongodb";
import { HOMEPAGE, User } from "./routes/common";
import { sign } from "jsonwebtoken";
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

export function sendResetPasswordEmail(user: WithId<User>) {
    const hashedPassword = md5(user.password);
    const jwt = sign({ userId: user._id, email: user.email, hashedPassword }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "5m" });

    const url = HOMEPAGE + "/resetPassword";
    //const url = "http://localhost:5000/resetPassword";

    transporter.sendMail(
        {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Reset Password",
            text: `There has been a request to reset your password for Accountability.
To reset your password, please use the following link:
        ${url}/${jwt}`,
        },
        function (error, info) {
            if (error) {
                console.error("Error sending email", error);
            } else {
                console.log("Email Sent Successfully");
            }

            console.log(info);
        }
    );
}
