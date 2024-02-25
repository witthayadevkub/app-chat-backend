const jwt = require("jsonwebtoken");
const User = require("../models/user-model.js");

exports.protectRoute = async (req, res, next) => {
  try {
    // const token = req.cookies.jwt;
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userID).select("-password");
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute", error);
    res.status(500).json(error.message);
  }
};
