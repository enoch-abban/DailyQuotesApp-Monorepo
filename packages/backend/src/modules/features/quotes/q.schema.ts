import { object, string } from "zod";


const quoteSchema = (function() {

    const createQuote = object({
        body: object({
            content: string().min(3).max(500),
            media: string().url({message: "Invalid media url"}).optional()
        })
    });

    const updateQuote = object({
        body: object({
            userId: string().min(24).max(24).optional(),
            content: string().min(3).max(500).optional(),
            media: string().url({message: "Invalid media url"}).optional(),
            reactionIds: string().min(24).max(24).array().optional(),
            reflectionIds: string().min(24).max(24).array().optional()
        })
    });

    return {
        createQuote,
        updateQuote
    }
})();

export default quoteSchema;