const router = require("express").Router();
const pth = "../../../";
const { DatabasePool } = require(pth + "database");
const { NotificationService } = require(pth + "services/notification");
const passport = require("passport");

const bearer = passport.authenticate("bearer", { session: false });
const pool = new DatabasePool();
const notificationService = new NotificationService(pool.get());

router.get("/", bearer, async (request, response) => {
  notificationService.getAllNotificationsForUser(request, response);
});

router.post("/read", bearer, async (request, response) => {
  notificationService.readNotification(request, response);
});

router.delete("/", bearer, async (request, response) => {
  notificationService.deleteNotification(request, response);
});

module.exports = router;
