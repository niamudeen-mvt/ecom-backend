const express = require("express");
const userRouter = express.Router();
const authControllers = require("../controller/auth.controller");
const { verifyToken, refreshToken } = require("../middleware/auth.middleware");
const {
  validateRegisterSchema,
  validateLoginSchema,
} = require("../middleware/validtion.middleware");

userRouter
  .route("/register")
  .post(validateRegisterSchema, authControllers.register);
userRouter.route("/login").post(validateLoginSchema, authControllers.login);
userRouter.route("/refresh-token").get(refreshToken);
userRouter.route("/logout").get(authControllers.logout);
userRouter.route("/user").get(verifyToken, authControllers.userDetails);

module.exports = userRouter;
