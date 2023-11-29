const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const header = req.headers?.authorization;
    const token = header?.split(" ")?.pop();
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, "top-secret");
    if (decoded) {
      req.name = decoded.name;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
