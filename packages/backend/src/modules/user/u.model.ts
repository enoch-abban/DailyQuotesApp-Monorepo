import { TypeOf } from "zod";
import userSchema from "./u.schema";
import { CreatedUpdatedAtType } from "../../globals/global.types";


export type CreateUserModel = TypeOf<typeof userSchema.createUser>["body"] & CreatedUpdatedAtType;
export type UpdateUserModel = TypeOf<typeof userSchema.updateUser>["body"] & CreatedUpdatedAtType;

