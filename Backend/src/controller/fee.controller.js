const FeeServices = require("../services/fee.services")

const createFee = async (req, res) => {
    try {

        const { classId } = req.params

        const adminId = req.user.id || req.user._id
        console.log(adminId)

        // Get fee data from request body
        const feeData = req.body

        const fee = await FeeServices.createFee(
            classId,
            adminId,
            feeData
        )

        return res.status(201).json({
            message: "Fee Added Successfully",
            data: fee
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            message: "Error While Creating Fee: " + error.message
        })
    }
}

module.exports = {
    createFee 
}
