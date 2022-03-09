const { Item } = require("../database/repositories/item");

class ItemService {
  #repo;

  constructor(pool) {
    this.#repo = new Item(pool);
  }

  async getAllItemTypes(response) {
    response.send({ success: true, types: await this.#repo.getAllItemTypes() });
  }

  async getAllItemsForType(request, response) {
    const { typeId, itemId } = request.query;
    if (typeId && !itemId) {
      response.send({
        success: true,
        items: await this.#repo.getAllItemsForType(typeId),
      });
    } else if (!typeId && itemId) {
      response.send({
        success: true,
        item: await this.#repo.getItemById(itemId),
      });
    } else {
      response.status(400).send({ success: false, error: "missing:value" });
    }
  }
}

module.exports = { ItemService };
