import {string, object, enum as zodEnum} from "zod"

const userSchema = (function () {

    const Roles = zodEnum(["admin", "user"]);
    const Genders = zodEnum(["M", "F"]);

    const phoneSchema = string().refine((val) => {
        // Regular expression to match phone numbers
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Allows country code and up to 15 digits
        return phoneRegex.test(val);
      }, {
        message: "Invalid phone number format"
      });
    
    const createUser = object({
        body: object({
            email: string().email({ message: "Invalid email address" }).refine(val => !!val, { message: "Email is required" }),
            firstName: string().refine(val => !!val, { message: "First name is required" }),
            lastName: string().refine(val => !!val, { message: "Last name is required" }),
            password: string().min(6, { message: "Password must be at least 6 characters long" }),
            phone: phoneSchema, 
            role: Roles,
            gender: Genders,
            image: string().optional(),  // Optional field
            middleName: string().optional(),  // Optional field
        })
    });

    const updateUser = object({
        body: object({
            email: string().email({ message: "Invalid email address" }).optional(),
            firstName: string().optional(),
            lastName: string().optional(),
            phone: phoneSchema.optional(), 
            role: Roles.optional(),
            gender: Genders.optional(),
            image: string().optional(),  // Optional field
            middleName: string().optional(),  // Optional field
        }),
        
        params: object({
            id: string({}).min(24).max(24)
          })
    });

    return {
        createUser, 
        updateUser
    };
})();

export default userSchema;