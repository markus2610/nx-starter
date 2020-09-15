import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginResult, SafeUser, TokenPayload, User, UserRole } from '@nx-starter/api-interfaces'
import * as bcryptjs from 'bcryptjs'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(email: string, pass: string): Promise<SafeUser> {
        const user = await this.usersService.findOne(email)
        if (user && user.password === pass) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async signup(dto: CreateUserDto): Promise<void> {
        const password = await this.createPasswordHash(dto.password)

        const newUser: User = {
            _id: Math.random().toString(),
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password,
            role: UserRole.User,
            verifyToken: null,
            isActive: false,
        }

        this.usersService.create(newUser)
    }

    async login(user: User): Promise<LoginResult> {
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
