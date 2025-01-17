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

export const getAllUserAccountsAggregation = (
    filter: {},
    sort: {},
    limit: number,
    skip: number
) => {
    return [
        {
            $match: filter,
        },
        {
            $unset: ["password", "verified", "role"]
        },
        {
            $facet: {
                "totalCount": [
                    {
                        $count: "count"
                    }
                ],
                "data": [
                    {
                        $sort: sort,
                    },
                    {
                        $skip: skip,
                    },
                    {
                        $limit: limit,
                    }
                ]
            }
        },
        {
            $unwind: "$totalCount"
        },
        {
            $project: {
                "data": 1,
                "totalCount": "$totalCount.count",
            }
        }
    ]
}