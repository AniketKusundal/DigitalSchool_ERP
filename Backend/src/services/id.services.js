const Student = require("../models/Student.model")
const User = require("../models/User.model")
const Staff = require("../models/Staff.model")
const School = require("../models/School.model")



const StudentIdCard = async(studentId , adminId) => {

    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Is Not Found")
    }

    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can Genrate The ID Crad")
    }

    const student = await Student.findById(studentId)
    .populate(
        "academicInfo.current_class",
        "class_name section"
    )

    if(!student)
    {
        throw new Error("Student Is Not Found")
    }

    
    if(student.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }


    const school = await School.findById(admin.school_id)


    if(!school)
    {
        throw new Error("School Is Not Associated With The Current Admin")
    }


    const CardData = {
      schoolName: school.school_name,
      schoolLogo: school.logo,
      email: school.email,
      phone: school.phone,
      address: school.address,
      village_name: school.village_name,
      city: school.city,
      state: school.state,
      pincode: school.pincode,

      // Student ID Card Info

      studentName: `${student.basicInfo.first_name}  ${student.basicInfo.father_name} ${student.basicInfo.surname}`,

      studentClass: student.academicInfo.current_class
        ? `${student.academicInfo.current_class.class_name} ${student.academicInfo.current_class.section}`
        : "Not Assigned",

      academic_year: student.academicInfo.academic_year,

      dob: student.basicInfo.dob.toLocaleDateString("en-IN"),

      student_photo: student.basicInfo.student_photo,
      studentAddress: student.address.full_address,
      parentPhone: student.parents_Info.father.phone,
    };


    return CardData;

    
}



const TeacherIdCard = async(teacherId , adminId) =>
{
    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }


    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can View The Teacher Id Card")
    }

    const teacher = await User.findById(teacherId) 
    .populate("assignedClass", "class_name section")

    if (!teacher) {
        throw new Error("Teacher Is Not Found")
    }

    if (teacher.role !== "TEACHER") {
        throw new Error("Selected User Is Not A Teacher")
    }

    //  security check

    if (!teacher.school_id || teacher.school_id.toString() !== admin.school_id.toString()) {
        throw new Error("Access Denied")
    }
    
    
    const school = await School.findById(admin.school_id)
     
    if(!school)
    {
        throw new Error("School Not Found")
    }

    const CardData = {
      schoolName: school.school_name,
      schoolLogo: school.logo,
      email: school.email,
      phone: school.phone,
      address: school.address,
      village_name: school.village_name,
      city: school.city,
      state: school.state,
      pincode: school.pincode,

      assigned_class: teacher.assignedClass
        ? `${teacher.assignedClass.class_name} ${teacher.assignedClass.section}`
        : "Not Assigned",

      teacher_name: teacher.name,

      teacher_email: teacher.email,

      teacher_phone: teacher.phone,

      teacher_photo: teacher.photo,

      designation: teacher.designation,
    };

    return CardData;


}


const StaffIdCard = async (staffId , adminId) => {
    
    const admin = await User.findById(adminId)

    if(!admin || !admin.school_id)
    {
        throw new Error("Admin Not Found")
    }

    if(admin.role !== "ADMIN")
    {
        throw new Error("Only Admin Can Generate Staff ID Card")
    }

    const staff = await Staff.findById(staffId)

    if(!staff)
    {
        throw new Error("Staff Is Not Found")
    }

    
    //  Security Check

    if(!staff.school_id || staff.school_id.toString() !== admin.school_id.toString())
    {
        throw new Error("Access Denied")
    }


    const school = await School.findById(admin.school_id)

    if(!school)
    {
        throw new Error("School Not Found")
    }


    const CardData = {

        schoolName  : school.school_name ,
        schoolLogo  : school.logo,
        email  : school.email,
        phone  : school.phone, 
        address  : school.address,
        village_name  : school.village_name,
        city  : school.city, 
        state  : school.state,
        pincode  : school.pincode,


        staff_photo : staff.staff_photo ,
        full_name : staff.full_name ,
        designation : staff.designation ,
        dob : staff.date_of_birth?.toLocaleDateString("en-IN"),
        gender : staff.gender ,
        contact_no : staff.contact_no ,


    }

    return CardData;

}

module.exports = {
    StudentIdCard ,
    TeacherIdCard ,
    StaffIdCard
}