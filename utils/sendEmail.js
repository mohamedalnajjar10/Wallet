const nodemalier = require("nodemailer");
const sendEmail = async (options) => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemalier.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOpts = {
    from: `"Wallet" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;
