import { CreateUserModel, UpdateUserModel } from "../user/u.model";


const authService = (function(){

    const getUserByFilter = async (filter: {}) => {

    }

    const saveAccount = async (data: CreateUserModel) => {

    }

    const updateAccount = async (id: string, data: UpdateUserModel) => {

    }

    const resetPassword = async (id: string, password: string) => {

    }

    const getAccountByFilter = async (filter: {}) => {

    }

    const getAllAccountsByFilter = async (filter: {}) => {
        
    }

    return {
        saveAccount,
        updateAccount,
        resetPassword,
        getAccountByFilter,
        getAllAccountsByFilter,
    }
})();

export default authService;