const { Card } = require("../database/repositories/card");
const { User } = require("../database/repositories/user");

class BillingService {
  #cardRepo;
  #userRepo;

  constructor(pool) {
    this.#cardRepo = new Card(pool);
    this.#userRepo = new User(pool);
  }

  async getAllCards(request, response) {
    let cards = await this.#cardRepo.getAllCards(request.user.id);
    response.send({ success: true, cards: cards });
  }

  async getCardsCount(request, response) {
    let count = await this.#cardRepo.getCardsCount(request.user.id);
    response.send({ success: true, count: count });
  }

  async deleteCard(request, response) {
    const { cardId } = request.body;
    if (!cardId) {
      response.status(400).send({ success: false });
      return;
    }
    await this.#cardRepo.deleteCard(request.user.id, parseInt(cardId));
    response.send({ success: true });
  }

  async addCard(request, response) {
    const { cardNumber, cvc, expiration } = request.body;
    if (!cardNumber || !cvc || !expiration) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    if (cardNumber.length !== 16) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    if (cvc.length < 3 || cvc.length > 4) {
      response.status(400).send({ success: false, error: "short:value" });
      return;
    }
    let usr = await this.#userRepo.getById(request.user.id);
    if (usr) {
      let cardExists = await this.#cardRepo.cardExists(
        request.user.id,
        cardNumber
      );
      if (cardExists === false) {
        let billing = {
          userId: request.user.id,
          cardNumber: cardNumber,
          expiration: expiration,
          cvc: cvc,
        };
        await this.#cardRepo.addNewCard(billing);
        response.send({ success: true });
      } else {
        response.status(400).send({ success: false, error: "existing:card" });
      }
    } else {
      response.status(404).send({ success: false, error: "invalid:user" });
    }
  }

  async checkCard(request, response) {
    const { cardId, cvc } = request.body;
    if (!cardId || !cvc) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    response.send({
      success: await this.#cardRepo.isCorrectCvc(request.user.id, cardId, cvc),
    });
  }
}

module.exports = { BillingService };
