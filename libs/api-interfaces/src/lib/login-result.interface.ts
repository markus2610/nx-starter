import { User } from './user.interface'

export interface LoginResult {
    user: User
    accessToken: string
    refreshToken: string
}
