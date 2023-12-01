const express = require("express");
const router = express.Router();
const authControllers = require("../controller/auth.controller");
const productController = require("../controller/product.controller");
const cartControllers = require("../controller/cart.controller");

router.route("/auth/register").post(authControllers.register);
router.route("/auth/login").post(authControllers.login);
router.route("/add-to-cart").post(cartControllers.addtoCart);
router.route("/remove-from-cart").post(cartControllers.removeFromCart);
router.route("/add-product").post(productController.addtoProduct);
router.route("/get-products").get(productController.getProducts);
router.route("/cart/:id").get(cartControllers.cartByUserId);
router.route("/auth/user/:id").get(authControllers.userById);

module.exports = router;
