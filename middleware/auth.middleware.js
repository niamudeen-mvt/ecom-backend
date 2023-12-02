const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    // const cookie = req?.headers?.cookie;
    // const token = cookie.split("=")[1];

    if (token) {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (decodedUser) {
        req.user = decodedUser;
        next();
      } else {
        return res.send({ message: "invalid token" });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { verifyToken };
