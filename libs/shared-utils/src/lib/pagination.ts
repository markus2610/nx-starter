export function getPaginationConfig(
    page: string | number,
    size: string | number,
    defaultSize = 10,
): PaginationConfig {
    const p = Number(page || 1) - 1
    const s = Number(size || defaultSize)

    return { page: p + 1, size: s, skip: p * s, limit: s }
}

export interface PaginationConfig {
    page: number
    size: number
    skip: number
    limit: number
}
