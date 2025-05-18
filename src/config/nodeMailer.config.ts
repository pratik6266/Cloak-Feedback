import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SENDER_GMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

export default transporter;