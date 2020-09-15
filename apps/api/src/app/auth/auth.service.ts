import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcryptjs from 'bcryptjs'
import { TokenPayload, User } from '@nx-starter/api-interfaces'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email)
        if (user && user.password === pass) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: User): Promise<{ accessToken: string }> {
        const accessToken = await this.createAccessToken(user)

        return { accessToken }
    }

    async createPasswordHash(passwordPlain: string): Promise<string> {
        return await bcryptjs.hash(passwordPlain, 10)
    }

    async comparePasswordWithHash(password: string, hash: string): Promise<boolean> {
        return await bcryptjs.compare(password, hash)
    }

    private async createAccessToken(user: User): Promise<string> {
        const payload: TokenPayload = {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            sub: user._id,
        }
        return this.jwtService.sign(payload)
    }
}
