const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // console.log("🔥 AUTH MIDDLEWARE HIT");

  try {
    const authHeader = req.headers.authorization;

    // console.log("HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // console.log("TOKEN:", token);
    // console.log("🔐 SECRET IN MIDDLEWARE:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("🔍 USER FROM TOKEN:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;

