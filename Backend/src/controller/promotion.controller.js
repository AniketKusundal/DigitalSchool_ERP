const promotionServices = require("../services/promotion.services");



const singlePromotionStudent = async (req, res) => {

    try {

        // Get studentId from URL params
        const { studentId } = req.params;

        // Get new class + result from body
        const { newClassId, result } = req.body;

        // Call service
        const promoteStudent =
            await promotionServices.promoteSingleStudent(

                studentId,
                newClassId,
                result,
                req.user.id,
            );

        // Success Response
        return res.status(200).json({

            Message: "Student Promoted Successfully",

            data: promoteStudent,
        });

    } catch (error) {

        return res.status(400).json({

            Message:
                "Error While Promoting Student " + error.message,
        });
    }
};





const multiplePromotionStudent = async (req, res) => {

    try {

        // studentIds MUST be array
        const { studentIds, newClassId, result } = req.body;

        // Call MULTIPLE service
        const promoteStudents =
            await promotionServices.promoteMultipleStudents(

                studentIds,
                newClassId,
                result,
                req.user.id,
            );

        // Success Response
        return res.status(200).json({

            Message:
                "Multiple Students Promoted Successfully",

            data: promoteStudents,
        });

    } catch (error) {

        return res.status(400).json({

            Message:
                "Error While Promoting Multiple Students "
                + error.message,
        });
    }
};





const entireClassPromotion = async (req, res) => {

    try {

        // old class from params
        const { oldClassId } = req.params;

        // new class + result from body
        const { newClassId, result } = req.body;

        // Call service
        const promoteStudents =
            await promotionServices.promoteEntireClass(

                oldClassId,
                newClassId,
                result,
                req.user.id,
            );

        // Success Response
        return res.status(200).json({

            Message:
                "Entire Class Promoted Successfully",

            data: promoteStudents,
        });

    } catch (error) {

        return res.status(400).json({

            Message:
                "Error While Promoting Entire Class "
                + error.message,
        });
    }
};





module.exports = {

    singlePromotionStudent,

    multiplePromotionStudent,

    entireClassPromotion,
};