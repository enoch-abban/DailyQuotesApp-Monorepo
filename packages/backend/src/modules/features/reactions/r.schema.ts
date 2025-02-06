import { object, string } from "zod";


const reactionsSchema = (function() {

    const createReaction = object({
        body: object({
            quoteId: string({message: "Invalid id passed☕!"}).min(24).max(24),
            emoji: string().emoji({message: "An emoji is required"}),
        })
    });

    const createReflectionReaction = object({
        body: object({
            reflectionId: string({message: "Invalid id passed☕!"}).min(24).max(24),
            emoji: string().emoji({message: "An emoji is required"}),
        })
    });

    const getQuoteByIDSchema = object({
        params: object({
          quoteId: string({message: "Invalid id passed☕!"}).min(24).max(24),
        }),
      });

    return {
        createReaction,
        getQuoteByIDSchema,
        createReflectionReaction
    }
})();

export default reactionsSchema;