const jwt = require("jsonwebtoken");
const { jwtDecode } = require("jwt-decode");

const verifyToken = (req, res, next) => {
  try {
    // const headers = req.headers["Authorizaton"];
    const cookie = req?.headers?.cookie;

    console.log(cookie, "cookie verifyToken");
    if (cookie) {
      const token = cookie.split("=")[1];

      if (token) {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (decodedUser) {
          if (decodedUser.exp && decodedUser.exp * 1000 < Date.now()) {
            return res.status(401).send({ message: "Token expired" });
          }

          req.user = decodedUser;
          next();
        } else {
          return res.send({ message: "invalid token" });
        }
      }
    } else {
      res.status(401).send({
        message: "Authentication headers required",
      });
    }
  } catch (error) {
    console.log(error, "verifytoken");
    res.status(500).send({
      message: error.message,
    });
  }
};

const refreshToken = (req, res, next) => {
  try {
    const cookie = req?.headers?.cookie;

    console.log(cookie, "cookie refreshToken");
    if (cookie) {
      const prevToken = cookie.split("=")[1];

      if (prevToken) {
        jwt.verify(prevToken, process.env.JWT_SECRET_KEY, (err, user) => {
          if (err) {
            console.log(err, "error refreshToken");
            return res.status(400).send({ message: "token is required" });
          }

          if (err.name === "TokenExpiredError") {
            const { userId, email, isAdmin } = user;
            res.clearCookie(userId.toString());
            res.cookie[userId.toString()] = "";

            // const result = jwtDecode(prevToken);
            const token = jwt.sign(
              {
                userId: userId.toString(),
                email: email,
                isAdmin: isAdmin,
              },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: process.env.TOKEN_EXPIRATION_TIME,
              }
            );

            res.cookie(userId.toString(), token, {
              path: "/",
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              httpOnly: true,
              sameSite: "lax",
            });

            req.user = user; // Set user info if needed
            next();
          }
        });
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
