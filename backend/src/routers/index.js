const express = require("express");
const cors = require("cors");
const router = express.Router();
const passport = require("passport");
const { localStrategy, bearerStrategy } = require("../services/auth");

const bearer = passport.authenticate("bearer", { session: false });

router.use(passport.initialize());
router.use(passport.session());
router.use(express.json());
router.use(cors());
router.options("*", cors());
passport.use(localStrategy);
passport.use(bearerStrategy);

router.use("/api/shop", require("./shop"));

router.get("/api/user/test/auth", bearer, async (request, response) => {
  response.send({ success: true });
});

module.exports = router;
