const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

const verifyToken = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];

    console.log(token, "token verifyToken");
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
    console.log(error, "verifytoken");
    res.status(500).send({
      message: error.message,
    });
  }
};

const refreshToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // const cookie = req?.headers?.cookie;

    if (token) {
      // const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const decodedUser = jwtDecode(token);
      if (decodedUser) {
        const token = jwt.sign(
          {
            userId: decodedUser?.userId.toString(),
            email: decodedUser?.email,
            isAdmin: decodedUser?.isAdmin,
          },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "30d",
          }
        );

        return res.status(200).send({
          refresh_token: token,
          message: "refresh token created successfully",
        });
      } else {
        return res.send({ message: "invalid token" });
      }
    } else {
      return res.status(401).send({
        message: "Authentication headers required",
      });
    }
  } catch (error) {
    console.log(error, "refreshToken");
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { verifyToken, refreshToken };
