import { object, string } from "zod";


const reactionsSchema = (function() {

    const createReaction = object({
        body: object({
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
        getQuoteByIDSchema
    }
})();

export default reactionsSchema;