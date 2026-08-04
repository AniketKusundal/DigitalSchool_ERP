const TeacherTimeTable = require("../models/TeacherTimeTable.model")
const Subject = require("../models/Subject.model")
const User = require("../models/User.model")



const CreateTeacherTimeTable = async(data  , adminId) => {

    const {class_id , teacher_id , subject_id , day , start_time , end_time , classroom_no , note} = data


    const admin = await User.findById(adminId)

    if (!admin || !admin.school_id) {
        
        throw new Error("Admin Not Found")
    }


    if (admin.role !== "ADMIN") {
        throw new Error("Only Admin Can Create Teacher Time Table")
    }



       const teacher = await User.findById(teacher_id);

       if (!teacher) {
         throw new Error("Teacher Not Found");
       }

       if (teacher.role !== "TEACHER") {
         throw new Error("Selected User Is Not A Teacher");
       }


    const teacherconflict = await TeacherTimeTable.findOne({

        teacher_id ,
        day ,
        start_time ,
        end_time ,
    })

    if (teacherconflict) {
        throw new Error("Teacher Already Assigned At The Time")
    }


    const subject = await Subject.findById(subject_id);

    if (!subject) {
      throw new Error("Subject Not Found");
    }

    if (subject.class_id.toString() !== class_id.toString()) {
      throw new Error("Subject Does Not Belong To This Class");
    }

    // class conglict

    const classconflict = await TeacherTimeTable.findOne({

        class_id ,
        day ,
        start_time ,
        end_time ,
    })

    if (classconflict) {
        throw new Error("Class Already Have Leacture A This Time")
    }

 


    const MakeTeacherTimeTable = await TeacherTimeTable.create({

        school_id : admin.school_id ,
        class_id ,
        teacher_id ,
        subject_id ,
        day ,
        start_time ,
        end_time ,
        classroom_no ,
        note ,
    })

    return MakeTeacherTimeTable
}







const UpdateTeacherTimeTable = async (timetableId , data , adminId) => {

    const admin = await User.findById(adminId)

    if (!admin || !admin.school_id) {
        
        throw new Error("Admin Not Found")
    }



    if (admin.role !== "ADMIN") {
        
        throw new Error("Only Admin Can Update The Timetable")
    }

    const timetable = await TeacherTimeTable.findById(timetableId)


    if (!timetable) {
        throw new Error("Timetable Not Found")
    }

    // Secuity Check


    if (timetable.school_id.toString() !== admin.school_id.toString()) {
        
        throw new Error("Access Denied")
    }

    // Update Teacher TimeTable
    
    
    Object.keys(data).forEach((keys) => {

        if(data[keys] !== undefined)
        {
            timetable[keys] = data[keys]
        }
    })


    await timetable.save()


    return timetable;

} 


const DeleteTeacherLecture = async(timetableId , adminId) => {
    
    const admin = await User.findById(adminId)
    console.log(admin)

    if (!admin || !admin.school_id) {
        
        throw new Error("Admin Not Found")
    }

    if (admin.role !== "ADMIN") {
        throw new Error("Only Can Admin Can Delete The Timetable")
    }

    const timetable = await TeacherTimeTable.findById(timetableId)

    if(!timetable)
    {
        throw new Error("Timetable Not Found")
    }


    // Security checl

    if (timetable.school_id.toString() !== admin.school_id.toString()) 
    {
        throw new Error("Access Denied")    
    }

    const deleteLeacture = await TeacherTimeTable.findByIdAndDelete(timetableId)

    return deleteLeacture
}


const GetAllLeactures = async(classId ,  adminId) => {

    const admin = await User.findById(adminId)

    if (!admin || !admin.school_id) {
        throw new Error("Admin Not Found")
    }

    if (admin.role !== "ADMIN") {
        throw new Error("Only Admin Can Fetch Or View The All Class Leacture")

    }

    const leactures = await TeacherTimeTable.find({

        class_id : classId,
        school_id : admin.school_id,
    }).populate("teacher_id" , "name email").populate("subject_id subject_name")


    return leactures

}



// Get All The Leactures OF Teacher


const GetAllLecOfTeacher = async(teacherId , adminId) => {
    
    const admin = await User.findById(adminId)

    if (!admin || !admin.school_id) {
        throw new Error("Admin Not Found")
    }

    if (admin.role !== "ADMIN") {
        throw new Error("Only Admin Can See The Teacher Lectures")
    }

    const Teacehr = await User.findById(teacherId)

    if (!Teacehr) {
        throw new Error("Teacher Not Found")
    }


    if(Teacehr.role !== "TEACHER")
    {
        throw new Error ("User Role Is Not A Teacher")
    }

    const AllLecTeacher = await TeacherTimeTable.find({

        teacher_id : teacherId ,
        school_id : admin.school_id ,
    }).populate("subject_id" , "subject_name").populate("class_name section")

    return AllLecTeacher
}



module.exports = {
    CreateTeacherTimeTable,
    UpdateTeacherTimeTable,
    DeleteTeacherLecture,
    GetAllLeactures,
    GetAllLecOfTeacher,
}