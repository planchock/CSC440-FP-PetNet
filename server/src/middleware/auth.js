const jwt = require("jsonwebtoken");

const secret = process.env.API_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || "";

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;

    if (decoded.exp < Date.now().valueOf() / 1000) {
      return res.status(401).send("Token expired");
    }

    return next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;
