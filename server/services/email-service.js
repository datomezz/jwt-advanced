const nodemailer = require("nodemailer");
const { SMTP_HOST, SMTP_PORT, SMTP_LOGIN, SMTP_PASSWORD } = process.env;

console.log("PORT", process.env.SMTP_PASSWORD);

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_LOGIN,
        pass : SMTP_PASSWORD
      }
    })
  }

  async sendActivationMail(email, link) {
    console.log(email, link);
    await this.transporter.sendMail({
      from: SMTP_LOGIN,
      to: email,
      subject: `Activation on ${process.env.API_URL}`,
      text: "",
      html: `
        <div style="display : flex; justify-content : center">
          <h1>For Activation Visit Link</h1>
          <a href="${link}">Link</a>
        </div>
      `
    })
  }
}

module.exports = new EmailService();