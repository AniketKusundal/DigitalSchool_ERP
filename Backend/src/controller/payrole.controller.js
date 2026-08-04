const PayroleServices = require("../services/payrole.services")



const createPayrole = async (req , res) => {
    
    try 
    {
        const userId = req.user.id

        const payrole = await PayroleServices.CreatePayrole(
            req.body ,
            userId ,
        )


        return res.status(200).json({
            Message : "Payment Successfully creadited To Staff",
            data : payrole
        })
    }
    catch (error) 
    {
        return res.status(401).json({
            Message  : "Error While Payin To Staff " + error.message
        })
    }
}


const MarkAsPaid = async (req , res) => {
    
    try 
    {
        const { id } = req.params

        const UpdatePayrole = await PayroleServices.MarkAsPaid(
            id ,
            req.user.id
            
        )


        return res.status(200).json({
            Message : "Payment Status Updated" ,
            data : UpdatePayrole
        })

    } 
    catch (error) 
    {
        return res.status(400).json({
            Message : "Error While Updating Payment Status " + error.message
        })
    }

}


const DeletePayment = async (req , res) => {
    
}

module.exports = {
    createPayrole ,
    MarkAsPaid,
}