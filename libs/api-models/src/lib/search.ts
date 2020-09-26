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

interface Config<T> {
    key: keyof T | null
    operator: SearchOperator
    value: string | null
}

function makeConfig<T>(valueAsString: string): Config<T> {
    const props = valueAsString.split(',')
    return {
        key: props[0] as keyof T,
        operator: props[1] as SearchOperator,
        value: props[2],
    }
}

export function buildSearchConfigFromString<T>(search: string) {
    const params: Config<T>[] = search.split('|').map((param) => makeConfig(param))

    let result = {}

    params.forEach((config) => {
        const query = buildMongoSearchQuery<T>(config.key, config.operator, config.value)
        result = { ...result, ...query }
    })
    console.log('TCL: query', result)
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
            if (value) return { [key]: JSON.parse(value) }
            break

        default:
            return { [key]: getMongoRegexQuery(operator, value) }
    }
}

function getMongoRegexQuery(operator: SearchOperator, value: string): { [key: string]: string } {
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
