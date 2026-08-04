const ReportServices = require("../services/report.services");


// =========================================
// SINGLE STUDENT REPORT
// =========================================

const getStudentReports = async (req, res) => {

    try {

        const { studentId, examId } = req.params;

        const report =
            await ReportServices.getStudentReport(
                studentId,
                examId
            );

        return res.status(200).json({
            Message: "Report Generated",
            data: report,
        });

    }
    catch (error) {

        return res.status(400).json({
            Message:
                "Error While Generating Report " +
                error.message
        });
    }
};


// =========================================
// FULL EXAM REPORT
// =========================================

const getExamReports = async (req, res) => {

    try {

        const { examId } = req.params;

        const report =
            await ReportServices.getExamReport(
                examId
            );

        return res.status(200).json({
            Message: "Exam Report Generated",
            data: report,
        });

    }
    catch (error) {

        return res.status(400).json({
            Message:
                "Error While Generating Report " +
                error.message
        });
    }
};


module.exports = {
    getStudentReports,
    getExamReports,
};