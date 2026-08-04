const feeStructureServices = require("../services/feeStructure.services")


const setFeeStructure = async(req , res) => {
    try {
          
        const {classId} = req.params
        
        const adminId =  req.user.id || req.user._id
        
        
        const feeData = req.body 
        
        
        const feeStructureData =  await feeStructureServices.setFeeStructure(
            
            classId ,
            adminId ,
            feeData , 
        )
        
        return res.status(201).json({
            Message : "Fee Structre Created And Set For The Class ", 
            data : feeStructureData
        })
    } 
    catch (error) {
        
        return res.status(400).json({
            Message : "While Creating The Fee Structure " + error.message
        })
    }
}


const getAllFeeStructure = async(req ,res) => {

    try {
        
        
        const adminId = req.user.id || req.user._id
        
        const getAllFeeStructureData = await feeStructureServices.getAllFeeStructure(adminId)

        return res.status(200).json({
            Message : "All Fee Structure Data Fetched Successfully" ,
            getAllFeeStructureData
        })

    } catch (error) {
        
        return res.status(400).json({
            Message : "Error While Fetching The Fee Structure Data " + error.message
        })
    }
}


const getFeeStructureOfClass = async (req , res) => {

    try 
    {
        const {classId} = req.params
        const adminId = req.user.id || req.user._id

        const getClassFeeStructureData = await feeStructureServices.getFeeStructureClass(
            adminId ,
            classId ,
        )


        return res.status(200).json({
            Message : "Class Fee Structure Fetched Siccessfully " ,
            data : getClassFeeStructureData
        })
    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Fetching The Class Fee Structure Details " + error.message
        })
    }
}


const updateFeeStructure = async(req , res) => {
    
    try
    {

        const {feeStructureId} = req.params
        
        const adminId = req.user.id || req.user._id
        const feeData = req.body 
        
        const updateFee = await feeStructureServices.updateFeeStructure(
            
            feeStructureId ,
            adminId ,
            feeData ,
        )
        
        return res.status(200).json({
            Message : "Class Fee Structure Updated Successfully ",
            updateFee ,
        })
    }
    catch(error)
    {
        return res.status(400).json({
            Message : "Error While Updating The Fee Structure " + error.message
        })
    }
}


const deleteFeeStructure = async(req ,  res) => {

    try {
        
   
    const {feeStructureId} = req.params 

    const adminId = req.user.id || req.user._id

    const deleteFeeStructureData =  await feeStructureServices.deleteFeeStructure(
        feeStructureId ,
        adminId ,
    )
    
    return res.status(200).json({
        Message : "Fee Structure Data Is Deleted Succesfully" ,
        deleteFeeStructureData
    })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Deleting The Fee Structure " + error.message
        }) 
    }
}

module.exports = {
    setFeeStructure , 
    getAllFeeStructure ,
    getFeeStructureOfClass ,
    updateFeeStructure ,
    deleteFeeStructure
}