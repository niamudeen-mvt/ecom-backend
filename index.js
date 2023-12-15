require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router/index.js");
const connectDb = require("./utils/db.js");
const stripe = require("stripe")(
  "sk_test_51ONYEWSGzoF127mQw8r8HaLb9GYelIQaTqO2cSbkD5saqTTF9ZhT4h3hW2EDYDGYMbcYP4izt0VsRG7JwHeehpNK00qRX8NLFO"
);
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("ecommerce backend is working");
});

// checkout api
app.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;

  console.log(products, "products");
  const lineItems = products.map((product) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: product.title,
        images: [product.image],
      },
      unit_amount: product.price * 100,
    },
    // quantity: product.qnty,
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/sucess",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

connectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server is running at port: ${process.env.PORT}`);
  });
});

module.exports = app;
