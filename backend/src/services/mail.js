const {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} = require("nodemailer");

class MailService {
  #transporter;

  constructor() {
    createTestAccount()
      .then(
        (ta) =>
          (this.#transporter = createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
              user: ta.user,
              pass: ta.pass,
            },
          }))
      )
      .catch((error) => {
        console.log(error);
      });
  }

  async sendActivationMail(email, generatedCode) {
    let mail = await this.#transporter.sendMail({
      from: '"TD7 WebShop" <noreply@td7ws.hr>',
      to: email,
      subject: "[TD7WS] Aktivacija računa",
      text: `Poštovani,\n\nVaš kod za aktivaciju TD7 WebShop računa je:\n\n${generatedCode}`,
    });
    console.log(`Activation mail sent to '${email}' (ID: ${mail.messageId}`);
    console.log(
      `Mail preview URL for mail with ID '${
        mail.messageId
      }': ${getTestMessageUrl(mail)}`
    );
  }

  async sendPasswordResetCode(email, generatedCode) {
    let mail = await this.#transporter.sendMail({
      from: '"TD7 WebShop" <noreply@td7ws.hr>',
      to: email,
      subject: "[TD7WS] Resetiranje lozinke",
      text: `Poštovani,\n\nVaš kod za resetirati lozinku svog TD7 WebShop računa (vezanog uz email adresu '${email}') je:\n\n${generatedCode}`,
    });
    console.log(
      `Password reset mail sent to '${email}' (ID: ${mail.messageId}`
    );
    console.log(
      `Mail preview URL for mail with ID '${
        mail.messageId
      }': ${getTestMessageUrl(mail)}`
    );
  }
}

module.exports = {
  MailService,
};
