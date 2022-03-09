const { User } = require("../database/repositories/user");
const { Order } = require("../database/repositories/order");
const { Notification } = require("../database/repositories/notification");
const { MailService } = require("./mail");
const { generateRandomString, hashPassword } = require("./auth");

class UserService {
  #userRepo;
  #orderRepo;
  #mailService;

  constructor(pool) {
    this.#userRepo = new User(pool);
    this.#orderRepo = new Order(pool, new Notification(pool));
    this.#mailService = new MailService();
  }

  async getActive(request, response) {
    response.send({
      active:
        (await this.#userRepo.getActivationCode(parseInt(request.user.id))) ===
        1,
    });
  }

  async activateAccount(request, response) {
    const { activationCode } = request.body;
    let dbActivationCode = await this.#userRepo.getActivationCode(
      parseInt(request.user.id)
    );
    if (parseInt(activationCode) === parseInt(dbActivationCode)) {
      await this.#userRepo.updateActivationCode(request.user.id, 1);
      response.send({ success: true });
    } else {
      response.send({ success: false });
    }
  }

  async resendActivation(request, response) {
    let dbActivationCode = await this.#userRepo.getActivationCode(
      parseInt(request.user.id)
    );
    if (parseInt(dbActivationCode) !== 1) {
      let usr = await this.#userRepo.getById(request.user.id);
      let code = Math.floor(100000 + Math.random() * 900000);
      await this.#mailService.sendActivationMail(usr.email, code);
      await this.#userRepo.updateActivationCode(request.user.id, code);
      response.send({ success: true });
    } else {
      response.send({ success: false });
    }
  }

  async forgotPassword(request, response) {
    const { email } = request.body;
    if (!email) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (email.length < 2) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    let exists = await this.#userRepo.exists(email, false);
    if (exists === true) {
      let usr = await this.#userRepo.getByEmail(email);
      if (usr) {
        let code = Math.floor(100000 + Math.random() * 900000);
        await this.#mailService.sendPasswordResetCode(usr.email, code);
        await this.#userRepo.updateActivationCode(usr.user_id, code);
        await this.#userRepo.updateJwtHash(usr.user_id, generateRandomString());
        response.send({ success: true });
      } else {
        response.status(404).send({ success: false, error: "invalid:user" });
      }
    } else {
      response.status(404).send({ success: false, error: "invalid:email" });
    }
  }

  async accountActivated(request, response) {
    const { code } = request.body;
    if (!code) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (code.toString().length !== 6) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    let exists = await this.#userRepo.codeExists(parseInt(code));
    response.send({ success: exists });
  }

  async updatePasswordAfterReset(request, response) {
    const { password, code } = request.body;
    if (!password || !code) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (password.toString().length < 8 || code.toString().length !== 6) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    let usr = await this.#userRepo.getByCode(code);
    if (usr) {
      let newPassword = hashPassword(
        password.toString(),
        usr.salt.toString()
      ).toString();
      await this.#userRepo.updatePasswordByCode(parseInt(code), newPassword);
      await this.#userRepo.activateAccount(usr.user_id);
      await this.#userRepo.updateJwtHash(usr.user_id, generateRandomString());
      response.send({ success: true });
    } else {
      response.status(404).send({ success: false, error: "invalid:user" });
    }
  }

  async getUserInfo(request, response) {
    let usr = await this.#userRepo.getById(request.user.id);
    if (usr) {
      let obj = {
        username: usr.username,
        email: usr.email,
        name: usr.name,
        surname: usr.surname,
        address: usr.complete_address,
        orders: parseInt(
          await this.#orderRepo.getTotalOrdersForUser(request.user.id)
        ),
      };
      response.send({ success: true, info: obj });
    } else {
      response.status(404).send({ success: false, error: "invalid:user" });
    }
  }

  async updateUserDetails(request, response) {
    const { email, completeAddress } = request.body;
    if (!email || !completeAddress) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (email.toString().length < 2 || completeAddress.toString().length < 2) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    let usr = await this.#userRepo.getById(request.user.id);
    if (usr) {
      await this.#userRepo.updateEmailAndCompleteAddressById(
        usr.user_id,
        email,
        completeAddress
      );
      response.send({ success: true });
    } else {
      response.status(404).send({ success: false, error: "invalid:user" });
    }
  }

  async getOrdersList(request, response) {
    let orders = await this.#orderRepo.getOrdersForUser(request.user.id);
    response.send({ success: true, orders: orders });
  }

  async getOrderInfo(request, response) {
    const { orderId } = request.query;
    if (!orderId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    response.send({
      success: true,
      info: await this.#orderRepo.getOrderDetails(request.user.id, orderId),
    });
  }
}

module.exports = { UserService };
