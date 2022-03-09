class Card {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async addNewCard(billing) {
    if (!billing) return;

    let result = await this.#pool.query(
      "SELECT * FROM shop_user_card_type WHERE type_id > 0"
    );

    let cardType = 0;
    for (let i = 0; i < result.rows.length; i++) {
      let row = result.rows[i];
      let pattern = new RegExp(row.regex);
      if (billing.cardNumber.toString().match(pattern)) {
        cardType = row.type_id;
        break;
      }
    }

    result = await this.#pool.query(
      "INSERT INTO shop_user_card (user_id, card_number, expires, cvc, card_type) " +
        "VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        billing.userId,
        billing.cardNumber,
        billing.expiration,
        billing.cvc,
        cardType,
      ]
    );
    return result.rows[0];
  }

  async getAllCards(userId) {
    let result = await this.#pool.query(
      "SELECT suc.*, suct.image FROM shop_user_card suc" +
        " LEFT JOIN shop_user_card_type suct ON suct.type_id = suc.card_type WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  }

  async getCardsCount(userId) {
    let result = await this.#pool.query(
      "SELECT COUNT(*) AS count FROM shop_user_card WHERE user_id = $1",
      [userId]
    );
    return result.rows[0].count;
  }

  async deleteCard(userId, cardId) {
    await this.#pool.query(
      "DELETE FROM shop_user_card WHERE user_id = $1 AND card_id = $2",
      [userId, cardId]
    );
  }

  async cardExists(userId, cardNumber) {
    let result = await this.#pool.query(
      "SELECT COUNT(*) AS count FROM shop_user_card WHERE user_id = $1 and card_number = $2",
      [userId, cardNumber]
    );
    return parseInt(result.rows[0].count) > 0;
  }

  async isCorrectCvc(userId, cardId, cvc) {
    let result = await this.#pool.query(
      "SELECT COUNT(*) AS count FROM shop_user_card WHERE user_id = $1 AND card_id = $2 AND cvc = $3",
      [userId, cardId, cvc]
    );
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = { Card };
