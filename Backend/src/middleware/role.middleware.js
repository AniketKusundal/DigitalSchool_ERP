
const roleMiddleware = (allowedRole) => {

    return(req , res , next) => {

        try 
        {

            // console.log("🔍 ALLOWED ROLE:", allowedRole);
            // console.log("🔍 USER FROM TOKEN:", req.user);

            
             if(!req.user)
        {
            return res.status(401).json({
                Message : "Unauthorized"
            })
        }

        if (!Array.isArray(allowedRole)) {
            allowedRole = [allowedRole]
        }


        // check using the includes

        if (!allowedRole.includes(req.user.role)) {
            return res.status(403).json({
                 Message: "Access Denied"
           });
        }


        next();
        } 
        catch (error) {
            return res.status(500).json({
                Message : "Server Error"
            })
        }   
    }
       
}

module.exports = roleMiddleware;