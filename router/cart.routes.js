const express = require("express");
const cartRouter = express.Router();
const cartControllers = require("../controller/cart.controller");
const { verifyToken } = require("../middleware/auth.middleware");

cartRouter.route("/").get(cartControllers.cartDetails);
cartRouter.route("/add").post(verifyToken, cartControllers.addtoCart);
cartRouter.route("/remove").post(verifyToken, cartControllers.removeFromCart);

module.exports = cartRouter;
