const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// *=================================================
//* user registration logic
// *================================================

const register = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("11111111111");
      console.log(errors.array(), "errors.array() ");
      return res.status(400).send({ errors: errors.array() });
    } else {
      console.log("22222222222");
      const { username, email, phone, password, isAdmin } = req.body;

      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).send({ message: "email already exists" });
      }

      const userCreated = await User.create({
        username,
        email,
        phone,
        password,
        isAdmin,
      });

      res.status(201).send({
        success: true,
        data: userCreated,
        message: "user registred successfully",
      });
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// *=================================================
//* user login logic
// *================================================

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    } else {
      const { email, password } = req.body;

      const userExist = await User.findOne({ email });
      if (!userExist) {
        return res.status(400).send({
          message: "Invalid Credentials",
        });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        userExist.password
      );

      const payload = {
        userId: userExist._id.toString(),
        email: userExist.email,
        isAdmin: userExist.isAdmin,
      };

      // json web token
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      });

      // refresh token

      const refresh_token = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
      });

      // setting jwt token in cookie

      // if (res.cookie[userExist._id.toString()]) {
      //   res.cookie[userExist._id.toString()] = "";
      // }
      // res.cookie(userExist._id.toString(), token, {
      //   path: "/",
      //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      //   httpOnly: true,
      //   sameSite: "lax",
      // });

      if (isPasswordMatch) {
        res.status(200).send({
          success: true,
          access_token: token,
          refresh_token: refresh_token,
          message: "user login successfully",
          userId: userExist._id.toString(),
        });
      } else {
        return res.status(401).send({
          message: "Invalid email or passoword",
        });
      }
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// *=================================================
//* USER BY ID logic
// *================================================

const userDetails = async (req, res) => {
  try {
    const userExist = await User.findById({ _id: req.user.userId });
    if (!userExist) {
      return res.status(400).send({
        message: "User not found",
      });
    } else {
      res.status(200).send({
        success: true,
        user: userExist,
        message: "user found successfully",
      });
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ msg: error });
  }
};

// *=================================================
//* REFRESH_TOKEN
// *================================================

const refreshToken = async (req, res) => {
  try {
    const token = req.body.refresh_token;
    if (token) {
      const decodedUser = jwt.verify(token, process.env.REFRESH_SECRET_KEY);

      if (decodedUser) {
        const token = jwt.sign(
          {
            userId: decodedUser?.userId.toString(),
            email: decodedUser?.email,
            isAdmin: decodedUser?.isAdmin,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
          }
        );

        return res.status(200).send({
          access_token: token,
          message: "new token generated successfully",
        });
      } else {
        return res.send({ message: "invalid token" });
      }
    }
  } catch (error) {
    console.log(error, "error");
    res.status(500).send({ msg: error });
  }
};

module.exports = { login, register, userDetails, refreshToken };
