const router = require("express").Router();
const pth = "../../../";
const { DatabasePool } = require(pth + "database");
const { BillingService } = require(pth + "services/billing");
const passport = require("passport");

const bearer = passport.authenticate("bearer", { session: false });
const pool = new DatabasePool();
const billingService = new BillingService(pool.get());

router.get("/", bearer, async (request, response) => {
  billingService.getAllCards(request, response);
});

router.get("/count", bearer, async (request, response) => {
  billingService.getCardsCount(request, response);
});

router.delete("/", bearer, async (request, response) => {
  billingService.deleteCard(request, response);
});

router.post("/", bearer, async (request, response) => {
  billingService.addCard(request, response);
});

router.post("/check", bearer, async (request, response) => {
  billingService.checkCard(request, response);
});

module.exports = router;
