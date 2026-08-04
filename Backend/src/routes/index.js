const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");
const schoolRoutes = require("./school.route");
const classRoutes = require("./class.route");

const router = express.Router();

// ✅ connect all routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/school", schoolRoutes);
router.use("/class", classRoutes);

module.exports = router;
