export enum SearchOperator {
    EQ = 'eq',
    NONE = '',
    LIKE = 'like',
    STARTS_WITH = 'starts',
    ENDS_WITH = 'ends',
    NOT = 'not',
    GT = 'gt',
    GTE = 'gte',
    LT = 'lt',
    LTE = 'lte',
    IS_BOOLEAN = 'is',
}

export function buildSearchConfigFromString<T>(search: string) {
    const params: string[][] = search.split('|').map((param) => param?.split(','))

    let result = {}

    params.forEach((x) => {
        const query = buildMongoSearchQuery<T>(x[0] as keyof T, x[1] as SearchOperator, x[2])
        result = { ...result, ...query }
    })
    console.log('TCL: UsersController -> constructor -> query', result)
    return result
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
            return { [key]: Boolean(value ?? JSON.parse(value)) }

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
        case SearchOperator.NONE:
        default:
            return { $regex: value, $options: 'i' }
    }
}
