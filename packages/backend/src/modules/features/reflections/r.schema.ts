import { object, string } from "zod";


const reflectionSchema = (function() {

    const createReflection = object({
        body: object({
            quoteId: string({message: "Invalid id passed☕!"}).min(24).max(24),
            content: string().min(3, {message: "Content length too short☕!"}).max(500, {message: "Content length too long☕!"}),
        })
    });

    const updateReflection = object({
        body: object({
            quoteId: string({message: "Invalid id passed☕!"}).min(24).max(24).optional(),
            content: string().min(3).max(500).optional(),
            reflectionIds: string().min(24).max(24).array().optional()
        })
    });

    return {
        createReflection,
        updateReflection
    }
})();

export default reflectionSchema;