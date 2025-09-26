import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

let resend = null;

if(!process.env.RESEND_API){
    console.log("Provide RESEND_API in side the .env file")
} else {
    resend = new Resend(process.env.RESEND_API);
}

const sendEmail = async({sendTo, subject, html })=>{
    try {
        if (!resend) {
            console.log("RESEND_API not configured. Email not sent.");
            return { message: "Email service not configured" };
        }

        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <noreply@amitprajapati.co.in>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail

