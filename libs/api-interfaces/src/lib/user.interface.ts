import { UserRole } from './user-role.enum'

export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    role: UserRole
    verifyToken?: string
    isActive: boolean
}

export type SafeUser = Omit<User, 'password' | 'verifyToken'>
