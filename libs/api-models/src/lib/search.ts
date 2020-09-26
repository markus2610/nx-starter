export enum SearchOperator {
    EQ = 'eq',
    LIKE = '',
    STARTS_WITH = 'sw',
    ENDS_WITH = 'ew',
    NOT = 'not',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    IS_BOOLEAN = 'is',
}

export function buildMongoSearchQuery<T>(
    key: keyof T | null,
    operator: SearchOperator,
    value: string,
): { [key: string]: any } {
    if (!key) return {}

    switch (operator) {
        case SearchOperator.GT:
            return { [key]: { $gt: Number(value) } }
        case SearchOperator.GTE:
            return { [key]: { $gte: Number(value) } }
        case SearchOperator.LT:
            return { [key]: { $lt: Number(value) } }
        case SearchOperator.LTE:
            return { [key]: { $lte: Number(value) } }
        case SearchOperator.IS_BOOLEAN:
            return { [key]: Boolean(JSON.parse(value)) }

        default:
            return { [key]: getMongoRegexConfig(operator, value) }
    }
}

function getMongoRegexConfig(operator: SearchOperator, value: string): { [key: string]: string } {
    if (!value) return {}

    switch (operator) {
        case SearchOperator.EQ:
            return { $regex: `^${value}$`, $options: 'i' }
        case SearchOperator.STARTS_WITH:
            return { $regex: `^${value}`, $options: 'i' }
        case SearchOperator.ENDS_WITH:
            return { $regex: `${value}$`, $options: 'i' }
        case SearchOperator.NOT:
            return { $regex: `^((?!${value}).)*$`, $options: 'i' }
        case SearchOperator.NOT:
            return { $regex: `^((?!${value}).)*$`, $options: 'i' }
        case SearchOperator.NOT:
            return { $regex: `^((?!${value}).)*$`, $options: 'i' }
        case SearchOperator.LIKE:
        default:
            return { $regex: value, $options: 'i' }
    }
}
