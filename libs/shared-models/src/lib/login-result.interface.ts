import { IUser } from './user.interface'

export interface LoginResult {
    user: IUser
    accessToken: string
    refreshToken: string
}
