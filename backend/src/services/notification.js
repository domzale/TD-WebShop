const { Notification } = require("../database/repositories/notification");

class NotificationService {
  #repo;

  constructor(pool) {
    this.#repo = new Notification(pool);
  }

  async getAllNotificationsForUser(request, response) {
    response.send({
      success: true,
      notifications: await this.#repo.getAllNotificationsForUser(
        request.user.id
      ),
    });
  }

  async readNotification(request, response) {
    const { notificationId } = request.body;
    if (!notificationId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    await this.#repo.readNotification(request.user.id, notificationId);
    response.send({ success: true });
  }

  async deleteNotification(request, response) {
    const { notificationId } = request.query;
    if (!notificationId) {
      response.status(400).send({ success: false, error: "missing:value" });
      return;
    }
    await this.#repo.deleteNotification(request.user.id, notificationId);
    response.send({
      success: true,
    });
  }
}

module.exports = { NotificationService };
