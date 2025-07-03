import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config(); 


const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
   port: process.env.EMAIL_PORT,
   secure: false,
   auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
   }
});

export const sendMail = async (options) => {
    const message = {
        from: process.env.EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html
    }

    try { 
        await transporter.sendMail(message) 
    } catch (error) { 
        console.log(error)
    }} 


