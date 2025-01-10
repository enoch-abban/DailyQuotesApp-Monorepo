import { Request, Response } from "express";


const authController = (function() {

    const emailLogin = async (req: Request, res: Response) => {

    }

    const verifyAccount = async (req: Request, res: Response) => {

    }

    const resetPassword = async (req: Request, res: Response) => {

    }

    const forgetPassword = async (req: Request, res: Response) => {

    }

    const createAccount = async (req: Request, res: Response) => {

    }

    const updateAccount = async (req: Request, res: Response) => {

    }

    const getCurrentUserProfile = async (req: Request, res: Response) => {

    }

    return {
        emailLogin,
        verifyAccount,
        resetPassword,
        forgetPassword,
        createAccount,
        updateAccount,
        getCurrentUserProfile
    }
})();

export default authController;