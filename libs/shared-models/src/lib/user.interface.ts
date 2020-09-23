import { EUserRole } from './user-role.enum'

export interface IUser {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    role: EUserRole
    verifyToken?: string
    isActive: boolean
}

export interface IAppUser {
    userId: string
    name: string
    role: EUserRole
}
