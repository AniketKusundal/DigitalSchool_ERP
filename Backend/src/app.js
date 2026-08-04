require("dotenv").config();
const express = require('express')
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")


const authRoutes = require("./routes/auth.route")
const createSchoolRoute = require("./routes/school.route")
const createClassRoute = require("./routes/class.route")
const createUserRoute = require("./routes/user.route")
const createStudentRoute = require("./routes/student.route")
const AttendaceRoute = require("./routes/attendance.route")
const SubjectRoute = require("./routes/subject.route")
const ExamRoute = require("./routes/exam.route")
const MarkRoute = require("./routes/mark.route")
const ReportRoute = require("./routes/report.route")
const StaffRoute = require("./routes/staff.route")
const PayroleRoute = require("./routes/payrole.route")
const TeacherTimeTable = require("./routes/TeacherTimeTable.route")
const PromotionSystem = require("./routes/promotion.route")
const IdCards = require("./routes/id.route")
const FeeRoute = require("./routes/fee.route")
const feeStructureRoute = require("./routes/feeStructure.route")


const app = express()


app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.urlencoded({ extended : true }));


// Routes And API
app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/school" , createSchoolRoute)
app.use("/api/v1/class" , createClassRoute)
app.use('/api/v1/user' , createUserRoute)
app.use("/api/v1/student" , createStudentRoute)
app.use("/api/v1/attendance" , AttendaceRoute)
app.use("/api/v1/subject" , SubjectRoute)
app.use("/api/v1/exam" , ExamRoute)
app.use("/api/v1/mark" , MarkRoute)
app.use("/api/v1/report" , ReportRoute)
app.use("/api/v1/staff" , StaffRoute)
app.use("/api/v1/payrole" , PayroleRoute)
app.use("/api/v1/TeacherTimeTable" , TeacherTimeTable)
app.use("/api/v1/Promotion" , PromotionSystem)
app.use("/api/v1/IdCard" , IdCards)
app.use("/api/v1/fee" , FeeRoute)
app.use("/api/v1/feestructure" , feeStructureRoute)


app.get("/" , (req , res) => {
    res.send("API IS RUNNING....")
})


module.exports = app;