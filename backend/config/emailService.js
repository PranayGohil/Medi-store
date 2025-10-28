import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rhett51@ethereal.email',
        pass: 'q125zke6EcESt4xX23'
    }
});

async function sendEmail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
}

export default sendEmail;

