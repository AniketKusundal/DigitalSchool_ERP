const express = require("express");

const {
    getStudentReports,
    getExamReports
} = require("../controller/report.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();



// SINGLE STUDENT REPORT


router.get(
    "/student/:studentId/exam/:examId",
    authMiddleware,
    getStudentReports
);



// FULL EXAM REPORT


router.get(
    "/exam/:examId",
    authMiddleware,
    getExamReports
);

module.exports = router;