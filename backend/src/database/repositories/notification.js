class Notification {
  #pool;

  constructor(pool) {
    this.#pool = pool;
  }

  async getAllNotificationsForUser(userId) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_notification_user WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  }

  async readNotification(userId, notificationId) {
    await this.#pool.query(
      "UPDATE shop_notification_user SET read = current_timestamp WHERE user_id = $1 AND notification_id = $2 AND read IS NULL",
      [userId, notificationId]
    );
  }

  async generateCartItemRemovedNotification(userId, username, item) {
    let result = await this.#pool.query(
      "SELECT * FROM shop_notification_template WHERE template_id = 1"
    );
    let template = result.rows[0];
    let content = template.content
      .replace("@username@", username)
      .replace("@itemname@", item);
    await this.#pool.query(
      "INSERT INTO shop_notification_user (template_id, user_id, title, content) VALUES (1, $1, $2, $3)",
      [userId, template.title, content]
    );
  }

  async deleteNotification(userId, notificationId) {
    await this.#pool.query(
      "DELETE FROM shop_notification_user WHERE user_id = $1 AND notification_id = $2",
      [userId, notificationId]
    );
  }
}

module.exports = { Notification };
