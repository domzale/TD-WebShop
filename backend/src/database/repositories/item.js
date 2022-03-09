class Item {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async getAllItemTypes() {
    let result = await this.#pool.query(
      "SELECT * FROM shop_item_type ORDER BY item_type_id ASC",
      []
    );
    return result.rows;
  }

  async getAllItemsForType(typeId) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_item WHERE type = $1 ORDER BY item_id ASC",
      [typeId]
    );
    return result.rows;
  }

  async getItemById(itemId) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_item WHERE item_id = $1",
      [itemId]
    );
    return result.rows[0];
  }

  async getItemAmount(itemId) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_item WHERE item_id = $1",
      [itemId]
    );
    return result.rows[0].amount;
  }
}

module.exports = { Item };
