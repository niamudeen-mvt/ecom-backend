const express = require("express");
const userRouter = express.Router();
const authControllers = require("../controller/auth.controller");
const { verifyToken, refreshToken } = require("../middleware/auth.middleware");

userRouter.route("/register").post(authControllers.register);
userRouter.route("/login").post(authControllers.login);
// userRouter
//   .route("/refresh-token")
//   .get(refreshToken, verifyToken, authControllers.userDetails);
userRouter.route("/logout").get(authControllers.logout);
userRouter.route("/user").get(verifyToken, authControllers.userDetails);

module.exports = userRouter;
