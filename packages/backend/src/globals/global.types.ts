export type CreatedUpdatedAtType = {
    updatedAt?: string,
    createdAt?: string
}

export const genericAggregation = (
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
                "totalCount": "$totalCount.count"
            }
        }
    ]
}