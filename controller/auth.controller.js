const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const bcrypt = require("bcrypt");

// *=================================================
//* user registration logic
// *================================================

const register = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// *=================================================
//* user login logic
// *================================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).send({
        message: "Invalid Credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);

    res.cookie("access_token", await userExist.generateToken(), {
      httpOnly: true,
      maxAge: 3600000,
    });
    if (isPasswordMatch) {
      res.status(200).send({
        success: true,
        message: "user login successfully",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return res.status(401).send({
        message: "Invalid email or passoword",
      });
    }
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

// *=================================================
//* USER BY ID logic
// *================================================

const userById = async (req, res) => {
  try {
    const userId = req.params.id;

    const userExist = await User.findById({ _id: userId });
    if (!userExist) {
      return res.status(400).send({
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      user: userExist,
      message: "user found successfully",
    });
  } catch (error) {
    res.status(500).send({ msg: error });
  }
};

module.exports = { login, register, userById };
