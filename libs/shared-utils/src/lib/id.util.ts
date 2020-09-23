import { customAlphabet } from 'nanoid'
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrst', 10)

export function nid(type: string): string {
    return `${type}_${nanoid()}`
}
