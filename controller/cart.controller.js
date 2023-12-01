const Cart = require("../models/cart.model");

// *=================================================
//* ADD TO CART LOGIC
// *================================================

const addtoCart = async (req, res) => {
  try {
    const { userId, product_id, title, description, image, category, price } =
      req.body;

    const productDetails = {
      product_id,
      title,
      description,
      image,
      category,
      price,
    };

    // Find the user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({ userId, cart: [] });
    }

    // Check if the product is already in the user's cart
    const productExists = userCart.cart.find(
      (item) => item.product_id === product_id
    );

    if (!productExists) {
      userCart.cart.push(productDetails);
      // Save the updated cart
      await userCart.save();
      res.status(201).send({
        success: true,
        message: "Product added to cart successfully",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Product already exists in the cart",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// *=================================================
//* REMOVE FROM CART BY ID LOGIC
// *================================================

const removeFromCart = async (req, res) => {
  try {
    const { userId, product_id } = req.body;
    console.log(req.body);

    // Find the user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ userId });

    console.log(userCart, "userCart");

    if (!userCart) {
      return res.status(400).send({
        success: false,
        message: "No Cart Found",
      });
    }

    userCart.cart = userCart.cart.filter(
      (item) => item.product_id !== product_id
    );

    // Save the updated cart
    await userCart.save();

    res.status(200).send({
      success: true,
      cart: userCart.cart,
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// *=================================================
//* CART BY USER ID LOGIC
// *================================================

const cartByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req.params);

    // Find the user's cart or create a new one if it doesn't exist
    let userCart = await Cart.findOne({ userId });

    if (userCart) {
      res.status(200).send({
        success: true,
        cart: userCart.cart,
        message: "cart found successfully",
      });
    } else {
      res.status(400).send({
        success: false,
        message: "no cart data found",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

module.exports = { addtoCart, cartByUserId, removeFromCart };
