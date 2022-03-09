class Order {
  #pool;
  #notification;

  constructor(pool, notification) {
    this.#pool = pool;
    this.#notification = notification;
  }

  async getTotalOrdersForUser(userId) {
    let result = await this.#pool.query(
      "SELECT so.* FROM shop_order so LEFT JOIN shop_order_status sos ON sos.order_id = so.order_id" +
        " WHERE shop_user_id = $1 AND sos.type_id > 0",
      [userId]
    );
    return result.rows ? result.rows.length : 0;
  }

  async getOrdersForUser(userId) {
    let result = await this.#pool.query(
      "SELECT so.order_id, so.date_of_order, sost.name," +
        " ROUND(SUM(si.cost * soi.shop_item_amount - soi.shop_item_amount * si.cost * si.discount / 100), 2) AS cost" +
        " FROM shop_order so LEFT JOIN shop_order_status sos ON sos.order_id = so.order_id" +
        " LEFT JOIN shop_order_status_type sost ON sost.status_id = sos.type_id" +
        " LEFT JOIN shop_order_item soi ON soi.order_id = so.order_id" +
        " LEFT JOIN shop_item si ON si.item_id = soi.shop_item_id" +
        " WHERE so.shop_user_id = $1 AND sos.type_id > 0 GROUP BY (so.order_id, sost.name) ",
      [userId]
    );
    return result.rows;
  }

  async getOrderDetails(userId, orderId) {
    let result = await this.#pool.query(
      "SELECT si.name, CONCAT(si.cost, 'kn') as cost, CONCAT(ROUND(si.discount, 0), '%') AS discount, " +
        "soi.shop_item_amount AS amount, CONCAT(soi.shop_item_amount * si.cost - soi.shop_item_amount * ROUND(si.cost * discount / 100, 2), 'kn') as total " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "WHERE soi.order_id = $1 AND so.shop_user_id = $2",
      [orderId, userId]
    );
    return result.rows;
  }

  async getCartDetails(userId) {
    let result = await this.#pool.query(
      "SELECT si.item_id AS id, si.name, CONCAT(si.cost, 'kn') as cost, CONCAT(ROUND(si.discount, 0), '%') AS discount, " +
        "soi.shop_item_amount AS amount, CONCAT(soi.shop_item_amount * si.cost - soi.shop_item_amount * ROUND(si.cost * discount / 100, 2), 'kn') as total " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "LEFT JOIN shop_order_status sos ON sos.order_id = soi.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1 ORDER BY si.name ASC",
      [userId]
    );
    return result.rows;
  }

  async getTotalPriceForCart(userId) {
    let result = await this.#pool.query(
      "SELECT CONCAT(SUM(soi.shop_item_amount * si.cost - soi.shop_item_amount * ROUND(si.cost * discount / 100, 2)), 'kn') as total " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "LEFT JOIN shop_order_status sos ON sos.order_id = soi.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1",
      [userId]
    );
    return result.rows[0].total;
  }

  async getTotalPriceForItemInCart(userId, itemId) {
    let result = await this.#pool.query(
      "SELECT CONCAT(soi.shop_item_amount * si.cost - soi.shop_item_amount * ROUND(si.cost * discount / 100, 2), 'kn') as total " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "LEFT JOIN shop_order_status sos ON sos.order_id = soi.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1 AND soi.shop_item_id = $2",
      [userId, itemId]
    );
    return result.rows[0].total;
  }

  async getTotalPriceForItemsInCart(userId, itemId) {
    let result = await this.#pool.query(
      "SELECT SUM(CONCAT(soi.shop_item_amount * si.cost - soi.shop_item_amount * ROUND(si.cost * discount / 100, 2), 'kn')) as total " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "LEFT JOIN shop_order_status sos ON sos.order_id = soi.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1 AND so.shop_order_id = $2",
      [userId, orderId]
    );
    return result.rows[0].total;
  }

  async getAmountForItemInCart(userId, itemId) {
    let result = await this.#pool.query(
      "SELECT soi.shop_item_amount AS amount " +
        "FROM shop_item si LEFT JOIN shop_order_item soi ON soi.shop_item_id = si.item_id LEFT JOIN shop_order so ON so.order_id = soi.order_id " +
        "LEFT JOIN shop_order_status sos ON sos.order_id = soi.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1 AND soi.shop_item_id = $2",
      [userId, itemId]
    );
    return result.rows[0] ? result.rows[0].amount : 0;
  }

  async addItemToCart(userId, itemId, amount) {
    let result = await this.#pool.query(
      "SELECT so.order_id AS id FROM shop_order so" +
        " LEFT JOIN shop_order_status sos ON sos.order_id = so.order_id WHERE sos.type_id = 0 AND so.shop_user_id = $1",
      [userId]
    );
    let orderId = 0;
    if (result && result.rows && result.rows[0] && result.rows[0].id) {
      orderId = parseInt(result.rows[0].id);
    }
    if (orderId === 0) {
      result = await this.#pool.query(
        "INSERT INTO shop_order (shop_user_id) VALUES ($1) RETURNING *",
        [userId]
      );
      if (result && result.rows && result.rows[0] && result.rows[0].order_id) {
        orderId = parseInt(result.rows[0].order_id);
        if (orderId > 0) {
          await this.#pool.query(
            "INSERT INTO shop_order_status (order_id, type_id) VALUES ($1, 0)",
            [orderId]
          );
        }
      }
    }
    if (orderId > 0) {
      result = await this.#pool.query(
        "SELECT COUNT(*) AS count FROM shop_order_item WHERE shop_item_id = $1 AND order_id = $2",
        [itemId, orderId]
      );
      if (result && result.rows && result.rows[0]) {
        let count = parseInt(result.rows[0].count);
        if (count === 0) {
          await this.#pool.query(
            "INSERT INTO shop_order_item (order_id, shop_item_id, shop_item_amount) VALUES ($1, $2, $3)",
            [orderId, itemId, amount]
          );
        } else {
          await this.#pool.query(
            "UPDATE shop_order_item SET shop_item_amount = shop_item_amount + $1 WHERE order_id = $2 AND shop_item_id = $3",
            [parseInt(amount), orderId, itemId]
          );
        }
        return true;
      }
    }
    return false;
  }

  async deleteItemFromCart(userId, itemId) {
    await this.#pool.query(
      "DELETE FROM shop_order_item WHERE shop_item_id IN (SELECT soi.shop_item_id FROM shop_order_item soi" +
        " LEFT JOIN shop_order so ON soi.order_id = so.order_id" +
        " LEFT JOIN shop_order_status sos ON sos.order_id = so.order_id" +
        " WHERE so.shop_user_id = $1 AND sos.type_id = 0 AND soi.shop_item_id = $2)",
      [userId, itemId]
    );
  }

  async updateItemAmount(userId, itemId, amount) {
    await this.#pool.query(
      "UPDATE shop_order_item SET shop_item_amount = $1 WHERE shop_item_id IN (SELECT soi.shop_item_id FROM" +
        " shop_order_item soi LEFT JOIN shop_order so ON so.order_id = soi.order_id" +
        " LEFT JOIN shop_order_status sos ON sos.order_id = so.order_id" +
        " WHERE so.shop_user_id = $2 AND sos.type_id = 0 AND soi.shop_item_id = $3)",
      [amount, userId, itemId]
    );
  }

  async checkout(userId) {
    let cart = await this.getCartDetails(userId);
    cart.forEach(async (item) => {
      await this.#pool.query(
        "UPDATE shop_item SET amount = amount - $1 WHERE item_id = $2",
        [item.amount, item.id]
      );
    });
    await this.#pool.query(
      "UPDATE shop_order_status SET type_id = 2 WHERE type_id = 0 AND order_id IN (" +
        "SELECT order_id FROM shop_order WHERE shop_user_id = $1)",
      [userId]
    );
    cart.forEach(async (item) => {
      let itemsByItem = (
        await this.#pool.query(
          "SELECT soi.* FROM shop_order_item soi LEFT JOIN shop_order so ON so.order_id = soi.order_id" +
            " WHERE so.shop_user_id != $1 AND soi.shop_item_id = $2",
          [userId, item.id]
        )
      ).rows;
      if (itemsByItem) {
        let itemLagerAmount = parseInt(
          (
            await this.#pool.query(
              "SELECT amount FROM shop_item WHERE item_id = $1",
              [item.id]
            )
          ).rows[0].amount
        );
        itemsByItem.forEach(async (itemByItem) => {
          let itemCartAmount = parseInt(itemByItem.shop_item_amount);
          if (itemCartAmount > itemLagerAmount) {
            await this.#pool.query(
              "DELETE FROM shop_order_item WHERE order_id = $1 AND shop_item_id = $2",
              [itemByItem.order_id, itemByItem.shop_item_id]
            );
            let user = (
              await this.#pool.query(
                "SELECT su.* FROM shop_user su LEFT JOIN shop_order so ON so.shop_user_id = su.user_id WHERE so.order_id = $1",
                [itemByItem.order_id]
              )
            ).rows[0];
            let item = (
              await this.#pool.query(
                "SELECT * FROM shop_item WHERE item_id = $1",
                [itemByItem.shop_item_id]
              )
            ).rows[0];
            if (user && item) {
              await this.#notification.generateCartItemRemovedNotification(
                user.user_id,
                user.username,
                item.name
              );
            }
          }
        });
      }
    });
  }
}

module.exports = { Order };
