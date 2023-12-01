const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  cart: [
    {
      product_id: Number,
      title: String,
      description: String,
      image: String,
      category: String,
      price: Number,
    },
  ],
});

// define the model and collection name
const Cart = new mongoose.model("Cart", cartSchema);
module.exports = Cart;
