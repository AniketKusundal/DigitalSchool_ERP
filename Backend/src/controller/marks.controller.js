const MarkServices = require("../services/mark.services")


const addMarks = async (req , res) => {
    

    try 
    {
        const userId = req.user.id

        const marks = await MarkServices.addMarks(
            req.body,
            userId
        )

        return res.status(200).json({
            Message : "Marks Added Successfully",
            data : marks
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Adding The Marks " + error.message 
        })
    }
}


module.exports = {
    addMarks,
}