import { Company } from '@nx-starter/client/main/company/interfaces/company.interface'
import { UserRole } from '@nx-starter/client/main/user/enum/user-role.enum'

export interface User {
    _id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    password: string
    role: UserRole
    company?: Company
    // messenger: Messenger
    verifyToken?: string
    isActive: boolean
}
