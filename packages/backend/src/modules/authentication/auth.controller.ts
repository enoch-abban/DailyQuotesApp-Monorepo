import { ApiResponse } from "@dqa/shared-data";
import { asyncHandler } from "../../globals/utils/asyncHandler";


const authController = (function() {

    const createAccount = asyncHandler( (req, res) => {
        // get the data from the request body

        // check user existence from the db

        // return error response if existence is true

        // hash the password

        // add created at and updated at

        // add user to db if existence is false

        // return the response
        return res
            .status(200)
            .json({
                data: {},
                message: "Account created successfully!"
            } as ApiResponse<{}>);
    });
    
    const emailLogin = asyncHandler ((req, res) => {

    });

    const verifyAccount = asyncHandler ((req, res) => {

    });

    const resetPassword = asyncHandler ((req, res) => {

    });

    const forgetPassword = asyncHandler ((req, res) => {

    });


    const updateAccount = asyncHandler ((req, res) => {

    });

    const getCurrentUserProfile = asyncHandler ((req, res) => {

    });

    return {
        createAccount,
        emailLogin,
        verifyAccount,
        resetPassword,
        forgetPassword,
        updateAccount,
        getCurrentUserProfile
    }
})();

export default authController;