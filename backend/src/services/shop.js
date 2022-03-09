const { User } = require("../database/repositories/user");
const { MailService } = require("./mail");
const { generateRandomString, hashPassword } = require("./auth");

class ShopService {
  #userRepo;
  #mailService;

  constructor(pool) {
    this.#userRepo = new User(pool);
    this.#mailService = new MailService();
  }

  async register(request, response) {
    const {
      email,
      username,
      password,
      name,
      surname,
      completeAddress,
      confirmPassword,
    } = request.body;
    if (
      !email ||
      !username ||
      !password ||
      !name ||
      !surname ||
      !completeAddress ||
      !confirmPassword
    ) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (
      email.toString().length < 2 ||
      username.toString().length < 2 ||
      password.toString().length < 2 ||
      name.toString().length < 2 ||
      surname.toString().length < 2 ||
      completeAddress.toString().length < 2 ||
      confirmPassword.toString().length < 2
    ) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    if (await this.#userRepo.exists(username, true)) {
      response.status(400).send({ success: false, error: "existing:username" });
      return;
    }
    if (await this.#userRepo.exists(email, false)) {
      response.status(400).send({ success: false, error: "existing:email" });
      return;
    }
    const salt = generateRandomString(),
      initJwtHash = generateRandomString(),
      hashedPassword = hashPassword(password, salt);
    const userObj = {
      username: username,
      password: hashedPassword,
      salt: salt,
      name: name,
      surname: surname,
      email: email,
      completeAddress: completeAddress,
      jwtHash: initJwtHash,
      activationCode: Math.floor(100000 + Math.random() * 900000),
    };
    const createdUser = await this.#userRepo.register(userObj);
    if (createdUser) {
      response.send({ success: true, id: createdUser.user_id });
      console.log(
        `User successfully registered with id ${createdUser.user_id} and username ${userObj.username}`
      );
      this.#mailService.sendActivationMail(
        userObj.email,
        userObj.activationCode
      );
    } else {
      response.send({ success: false, error: "create:failed" });
    }
  }

  async logout(request, response) {
    await this.#userRepo.updateJwtHash(request.user.id, generateRandomString());
    response.send({ success: true });
  }
}

module.exports = { ShopService };
