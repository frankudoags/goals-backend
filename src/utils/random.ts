import nodemailer from "nodemailer";

const resetPasswordHtml = (name: string, url: string) => {
  return `
    <html>
    <head>
        <style>
        </style>
    </head>
    <body>
        <p>Hi ${name},</p>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p> Please, click the link below to reset your password</p>
        <a href="${url}">Reset Password</a>
    </body>
</html>
    `;
};

export const sendEmail = async (to: string, url: string, name: string) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Goal Tracker" <${process.env.SMTP_EMAIL}>`, // sender address
    to, // list of receivers
    subject: "Password Reset Request", // Subject line
    html: resetPasswordHtml(name, url), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
