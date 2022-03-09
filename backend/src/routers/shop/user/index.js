const router = require("express").Router();
const pth = "../../../";
const { DatabasePool } = require(pth + "database");
const { UserService } = require(pth + "services/user");
const passport = require("passport");

const bearer = passport.authenticate("bearer", { session: false });
const pool = new DatabasePool();
const userService = new UserService(pool.get());

router.use("/billing", require("./billing"));
router.use("/cart", require("./cart"));
router.use("/notification", require("./notification"));

router.get("/active", bearer, async (request, response) => {
  userService.getActive(request, response);
});

router.post("/activation", bearer, async (request, response) => {
  userService.activateAccount(request, response);
});

router.get("/activation/resend", bearer, async (request, response) => {
  userService.resendActivation(request, response);
});

router.post("/forgot", async (request, response) => {
  userService.forgotPassword(request, response);
});

router.post("/code", async (request, response) => {
  userService.accountActivated(request, response);
});

router.post("/reset", async (request, response) => {
  userService.updatePasswordAfterReset(request, response);
});

router.get("/info", bearer, async (request, response) => {
  userService.getUserInfo(request, response);
});

router.post("/update", bearer, async (request, response) => {
  userService.updateUserDetails(request, response);
});

router.get("/order/history", bearer, async (request, response) => {
  userService.getOrdersList(request, response);
});

router.get("/order/info", bearer, async (request, response) => {
  userService.getOrderInfo(request, response);
});

module.exports = router;
