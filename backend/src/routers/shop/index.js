const router = require("express").Router();
const pth = "../../";
const { DatabasePool } = require(pth + "database");
const { ShopService } = require(pth + "services/shop");
const passport = require("passport");

const local = passport.authenticate("local", { session: false });
const bearer = passport.authenticate("bearer", { session: false });
const pool = new DatabasePool();
const shopService = new ShopService(pool.get());

router.use("/item", require("./item"));
router.use("/user", require("./user"));

router.post("/register", async (request, response) => {
  shopService.register(request, response);
});

router.post("/login", local, (request, response) => {
  response.send({
    token: request.user,
  });
});

router.get("/logout", bearer, async (request, response) => {
  shopService.login(request, response);
});

module.exports = router;
