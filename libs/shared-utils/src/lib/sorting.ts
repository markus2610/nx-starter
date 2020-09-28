export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export interface SortConfig {
    [key: string]: SortOrder
}

export function getSortConfig(
    sort: string | string[] = 'createdAt',
    order: SortOrder | SortOrder[] = SortOrder.DESC,
): SortConfig {
    const result = {}
    const _sort = Array.isArray(sort) ? sort : sort.split(',')
    let _order = Array.isArray(order) ? order : order.split(',')

    if (_order.length !== _sort.length) {
        const fillerArray = new Array(Math.abs(_sort.length - _order.length))
        fillerArray.map((x) => SortOrder.DESC)
        _order = [..._order, ...fillerArray]
    }
    _sort.forEach((x, i) => (result[x] = _order[i]))
    return result
}
