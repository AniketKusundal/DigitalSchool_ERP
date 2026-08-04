const Student = require("../models/Student.model");
const Mark = require("../models/Mark.model");
const Exam = require("../models/Exam.model");


// ======================================================
// SINGLE STUDENT REPORT
// ======================================================

const getStudentReport = async (studentId, examId) => {

    // Find Student
    const student = await Student.findById(studentId);

    if (!student) {
        throw new Error("Student Not Found");
    }

    // Find Exam
    const exam = await Exam.findById(examId);

    if (!exam) {
        throw new Error("Exam Not Found");
    }

    // Find Student Marks
    const marksData = await Mark.find({
        student_id: studentId,
        exam_id: examId,
    }).populate("subject_id", "subject_name");


    if (!marksData.length) {
        throw new Error("No Marks Found");
    }

    // Total Variables
    let obtainedMarks = 0;
    let totalMarks = 0;

    // Subject Wise Data
    const subjects = marksData.map((item) => {

        obtainedMarks += item.marks;

        totalMarks += item.total_marks;

        return {

            subject:
                item.subject_id.subject_name,

            obtained_marks:
                item.marks,

            total_marks:
                item.total_marks,
        };
    });

    // Calculate Percentage
    const percentage =
        (obtainedMarks / totalMarks) * 100;

    // Grade Logic
    let grade;

    if (percentage >= 90) {
        grade = "A+";
    }
    else if (percentage >= 75) {
        grade = "A";
    }
    else if (percentage >= 60) {
        grade = "B";
    }
    else if (percentage >= 50) {
        grade = "C";
    }
    else {
        grade = "F";
    }

    // PASS / FAIL
    const result =
        percentage >= 35
            ? "PASS"
            : "FAIL";

    // Final Response
    return {

        student_name:
            `${student.basicInfo.first_name} ${student.basicInfo.surname}`,

        exam_name:
            exam.exam_name,

        subjects,

        obtained_marks:
            obtainedMarks,

        total_marks:
            totalMarks,

        percentage:
            percentage.toFixed(2),

        grade,

        result,
    };
};



// ======================================================
// FULL EXAM REPORT
// ======================================================

const getExamReport = async (examId) => {

    // Find Exam
    const exam = await Exam.findById(examId);

    if (!exam) {
        throw new Error("Exam Not Found");
    }

    // Find All Marks Of This Exam
    const marksData = await Mark.find({
        exam_id: examId,
    })
    .populate("student_id")
    .populate("subject_id", "subject_name");


    if (!marksData.length) {
        throw new Error("No Marks Found");
    }

    // Student Wise Grouping
    const reportMap = {};

    marksData.forEach((item) => {

        // Skip Invalid Students
        if (!item.student_id) {
            return;
        }

        const studentId =
            item.student_id._id.toString();

        // Create Student Object
        if (!reportMap[studentId]) {

            reportMap[studentId] = {

                student_name:
                    `${item.student_id.basicInfo.first_name} ${item.student_id.basicInfo.surname}`,

                subjects: [],

                obtained_marks: 0,

                total_marks: 0,
            };
        }

        // Add Subject Data
        reportMap[studentId].subjects.push({

            subject:
                item.subject_id.subject_name,

            obtained_marks:
                item.marks,

            total_marks:
                item.total_marks,
        });

        // Calculate Totals
        reportMap[studentId].obtained_marks += item.marks;

        reportMap[studentId].total_marks += item.total_marks;
    });

    // Final Report Array
    const finalReport =
        Object.values(reportMap).map((student) => {

            const percentage =
                (student.obtained_marks /
                 student.total_marks) * 100;

            return {

                ...student,

                percentage:
                    percentage.toFixed(2),

                result:
                    percentage >= 35
                        ? "PASS"
                        : "FAIL",
            };
        });

    // Final Response
    return {

        exam_name:
            exam.exam_name,

        total_students:
            finalReport.length,

        reports:
            finalReport,
    };
};



// ======================================================
// EXPORTS
// ======================================================

module.exports = {
    getStudentReport,
    getExamReport,
};