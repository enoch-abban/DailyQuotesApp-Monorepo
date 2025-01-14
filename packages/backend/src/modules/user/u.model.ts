import { TypeOf } from "zod";
import userSchema from "./u.schema";
import { CreatedUpdatedAtType } from "../../globals/global.types";


export type CreateUserModel = TypeOf<typeof userSchema.createUser>["body"] & { verified: boolean } & CreatedUpdatedAtType;
export type UpdateUserModel = TypeOf<typeof userSchema.updateUser>["body"] & { verified?: boolean } & CreatedUpdatedAtType;

export const getUserAccountAggregation = (filter: {}) => {
    return [
        {
            $match: filter,
        },
      
        {
            $project: {password:0, verified:0, role:0,},
        },
    ]
}