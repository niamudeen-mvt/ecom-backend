require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./router/auth.router.js");
const connectDb = require("./utils/db.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

const PORT = 5000;

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
