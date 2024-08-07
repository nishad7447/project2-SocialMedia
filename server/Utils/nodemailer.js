import nodemailer from "nodemailer";

const sendEmail = async ({email, subject, text}) => {
    try {
        const transporter = nodemailer.createTransport({
            // host: process.env.HOST,
            service: process.env.SERVICE,
            // port: 587,
            // secure: true,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASS,
            },
        });
        console.log({transporter})
        await transporter.sendMail({
            from: process.env.USER_NAME,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

 export default sendEmail;