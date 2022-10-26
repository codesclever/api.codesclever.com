const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();
const userEmail = process.env.EMAIL;
const userEmailPassword = process.env.EMAIL_PASSWORD;

let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: userEmail,
        pass: userEmailPassword,
    },
});

const mailSub = "About OTP";

sendOtpEmail = async (email, otp) => {
    var mailData = {
        from: userEmail,
        to: email,
        subject: mailSub,
        html: `
        <h1>CodesClever</h1>
        <p>Is Your OTP  <strong>${otp}</strong> </p>
        <p>Do not share OTP with Others</p>
        <br>
        <br>
        <br>
        <br>
        <br>
        <p>Team,</p>
        <p>-CodesClever</p>
        `,
    };

    try {
        let mInfo = await transporter.sendMail(mailData);
        console.log("send mail successfully");
        return true;
    } catch (err) {
        console.log("not send mail" + err);
        return false;
    }
};

module.exports = sendOtpEmail;
