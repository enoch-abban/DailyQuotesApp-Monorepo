import { object, string } from "zod";


const authSchema = (function(){
    const signInSchema = object({
        body: object({
          email: string().email({ message: "Invalid email address" }).refine(val => !!val, { message: "Email is required" }),
    
          password: string().min(6, { message: "Password must be at least 6 characters long" }),
    
        })
    });

    const verifyAccountSchema = object ({
        body: object({
            token: string()
        })
    })

    const forgetPasswordSchema = object({
        body: object({
            email: string().email({ message: "Invalid email address" }).refine(val => !!val, { message: "Email is required" })
        })
    })

    const resetPasswordSchema = object({
        body: object({
            password: string().min(6, { message: "Password must be at least 6 characters long" })
        })
    })

    return {
        signInSchema,
        verifyAccountSchema,
        forgetPasswordSchema,
        resetPasswordSchema,
    }
})();


export default authSchema;