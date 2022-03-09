const { Order } = require("../database/repositories/order");
const { Item } = require("../database/repositories/item");
const { Notification } = require("../database/repositories/notification");

class CartService {
  #orderRepo;
  #itemRepo;

  constructor(pool) {
    this.#orderRepo = new Order(pool, new Notification(pool));
    this.#itemRepo = new Item(pool);
  }

  async addItemToCart(request, response) {
    const { itemId, amount } = request.body;
    if (!itemId || !amount) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    let intAmount = parseInt(amount);
    let cartAmount = parseInt(
      await this.#orderRepo.getAmountForItemInCart(request.user.id, itemId)
    );
    let totalAmount = cartAmount + intAmount;
    let lagerAmount = parseInt(await this.#itemRepo.getItemAmount(itemId));
    if (totalAmount > 0 && totalAmount <= 1000 && totalAmount <= lagerAmount) {
      response.send({
        success: await this.#orderRepo.addItemToCart(
          request.user.id,
          itemId,
          amount
        ),
      });
    } else {
      response.status(400).send({ success: false, error: "invalid:amount" });
    }
  }

  async getTotalPriceForCart(request, response) {
    response.send({
      success: true,
      total: await this.#orderRepo.getTotalPriceForCart(request.user.id),
    });
  }
  async getCartDetails(request, response) {
    response.send({
      success: true,
      info: await this.#orderRepo.getCartDetails(request.user.id),
    });
  }

  async deleteItemFromCart(request, response) {
    const { itemId } = request.query;
    if (!itemId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    await this.#orderRepo.deleteItemFromCart(request.user.id, itemId);
    response.send({
      success: true,
    });
  }

  async updateItemAmount(request, response) {
    const { itemId, amount } = request.body;
    if (!itemId || !amount) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    let intAmount = parseInt(amount);
    let lagerAmount = parseInt(await this.#itemRepo.getItemAmount(itemId));
    if (intAmount > 0 && intAmount <= 1000 && intAmount <= lagerAmount) {
      await this.#orderRepo.updateItemAmount(request.user.id, itemId, amount);
      response.send({
        success: true,
      });
    } else {
      response.status(400).send({ success: false, error: "invalid:amount" });
    }
  }

  async getTotalPriceForItemInCart(request, response) {
    const { itemId } = request.query;
    if (!itemId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    response.send({
      success: true,
      total: await this.#orderRepo.getTotalPriceForItemInCart(
        request.user.id,
        itemId
      ),
    });
  }

  async getAmountForItemInCart(request, response) {
    const { itemId } = request.query;
    if (!itemId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    response.send({
      success: true,
      amount: await this.#orderRepo.getAmountForItemInCart(
        request.user.id,
        itemId
      ),
    });
  }

  async checkout(request, response) {
    const { cardId } = request.body;
    if (!cardId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    await this.#orderRepo.checkout(request.user.id);
    response.send({ success: true });
  }
}

module.exports = { CartService };
