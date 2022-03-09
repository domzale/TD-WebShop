const router = require("express").Router();
const pth = "../../../";
const { DatabasePool } = require(pth + "database");
const { CartService } = require(pth + "services/cart");
const passport = require("passport");

const bearer = passport.authenticate("bearer", { session: false });
const pool = new DatabasePool();
const cartService = new CartService(pool.get());

router.post("/add", bearer, async (request, response) => {
  cartService.addItemToCart(request, response);
});

router.get("/total", bearer, async (request, response) => {
  cartService.getTotalPriceForCart(request, response);
});

router.get("/info", bearer, async (request, response) => {
  cartService.getCartDetails(request, response);
});

router.delete("/delete", bearer, async (request, response) => {
  cartService.deleteItemFromCart(request, response);
});

router.post("/save", bearer, async (request, response) => {
  cartService.updateItemAmount(request, response);
});

router.get("/item/price", bearer, async (request, response) => {
  cartService.getTotalPriceForItemInCart(request, response);
});

router.get("/item/amount", bearer, async (request, response) => {
  cartService.getAmountForItemInCart(request, response);
});

router.post("/checkout", bearer, async (request, response) => {
  cartService.checkout(request, response);
});

module.exports = router;
