import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { LoginResult, TokenPayload, User, UserRole } from '@nx-starter/api-interfaces'
import * as bcryptjs from 'bcryptjs'
import { nanoid } from 'nanoid'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async getAuthenticatedUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findByEmail(email)
        if (!user) throw new NotFoundException('User not found')

        const passwordMatched = await this.comparePasswordWithHash(password, user.password)
        if (passwordMatched) {
            return user
        }
        return null
    }

    async signup(dto: CreateUserDto): Promise<User> {
        const userExists = await this.isEmailTaken(dto.email)
        if (userExists) {
            throw new BadRequestException('User with the given email already exists')
        }

        const password = await this.createPasswordHash(dto.password)
        const verifyToken = this.createVerifyToken()

        const newUser: User = {
            _id: undefined,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password,
            role: UserRole.User,
            verifyToken,
            isActive: false,
        }

        const user = await this.usersService.create(newUser)
        user.password = undefined
        user.verifyToken = undefined
        return user
    }

    async verifyByToken(token: string): Promise<User> {
        const user = await this.usersService.findByToken(token)
        if (user) {
            return await this.usersService.update(user._id, { isActive: true, verifyToken: '' })
        }
        return null
    }

    async login(user: User): Promise<LoginResult> {
        const accessToken = await this.createAccessToken(user)

        return { accessToken }
    }

    async forgotPassword(email: string): Promise<User> {
        const user = await this.usersService.findByEmail(email)
        if (user) {
            const verifyToken = this.createVerifyToken()
            return await this.usersService.update(user._id, { isActive: false, verifyToken })
        }
        return null
    }

    async resetPassword(token: string, password: string, passwordConfirm: string): Promise<User> {
        const user = await this.usersService.findByToken(token)
        if (!user) {
            throw new UnauthorizedException('Invalid token')
        }
        if (password !== passwordConfirm) {
            throw new BadRequestException('Passwords do not match')
        }
        const hashedPassword = await this.createPasswordHash(password)
        return await this.usersService.update(user._id, { password: hashedPassword, isActive: true, verifyToken: '' })
    }

    async changePassword(userId: string, password: string, passwordConfirm: string): Promise<User> {
        const user = await this.usersService.findById(userId)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        if (password !== passwordConfirm) {
            throw new BadRequestException('Passwords do not match')
        }
        const hashedPassword = await this.createPasswordHash(password)
        return await this.usersService.update(user._id, { password: hashedPassword })
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

    private async isEmailTaken(email: string): Promise<boolean> {
        const result = await this.usersService.findByEmail(email)
        return Boolean(result)
    }

    private createVerifyToken(): string {
        return nanoid(32)
    }
}
