import { object, string } from "zod";

const globalSchema = (function () {
  const getByIdSchema = object({
    params: object({
      id: string({}).min(24).max(24),
    }),
  });

  return {
    getByIdSchema
  };
})();

export default globalSchema;
