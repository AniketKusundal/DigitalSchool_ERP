const schoolServices = require("../services/school.services")

const createSchool = async(req , res) => {

    try 
    {
        const userId = req.user.id
        

        
        if (req.file) {
            req.body.logo = req.file.path
        }
        const school = await schoolServices.createSchool(
            req.body,
            userId
        )


        return res.status(201).json({
            message : "School  Created Successfully",
            data : school,
        });



    } 
    catch (error) 
    {
        return res.status(400).json({
            message : error.message
        })
    }
}



// Update School Data

const updateSchoolData = async(req , res) => {


    try {
        
    
    const user = req.user.id 

    const checkFile = req.file

    if (checkFile) {
        req.body.logo = req.file.path
    }


    const schoolData = await schoolServices.updateSchoolData(
        req.body , 
        req.user.id
    )


    return res.status(200).json({
        Message : "School Data Updated Successfully" ,
        data : schoolData 
    })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Updatig The Data " + error.message
        })
    }
}




const getSchoolData = async(req , res) => {

    try 
    {   
        const schoolData = await schoolServices.getSchoolData(req.user.id)

        return res.status(200).json({
            Message : "School Details Fetched" ,
            data : schoolData
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching School Detils " + error.message
        })
    }
}

module.exports = {
    createSchool ,
    updateSchoolData ,
    getSchoolData ,
}