import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EUserRole, IUser, LoginResult, TokenPayload } from '@nx-starter/shared/data-access'
import * as bcryptjs from 'bcryptjs'
import { nanoid } from 'nanoid'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UsersService } from '../users/users.service'
import { RefreshTokenService } from './refresh-token.service'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private refreshTokenService: RefreshTokenService,
    ) {}

    async getAuthenticatedUser(email: string, password: string): Promise<IUser> {
        const user = await this.usersService.findByEmail(email)
        if (!user) throw new NotFoundException('User not found')

        const passwordMatched = await this.comparePasswordWithHash(password, user.password)
        if (passwordMatched) {
            return user
        }
        return null
    }

    async signup(dto: CreateUserDto): Promise<IUser> {
        const userExists = await this.isEmailTaken(dto.email)
        if (userExists) {
            throw new BadRequestException('User with the given email already exists')
        }

        const password = await this.createPasswordHash(dto.password)
        const verifyToken = this.createVerifyToken()

        const newUser: IUser = {
            _id: undefined,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            password,
            role: EUserRole.User,
            verifyToken,
            isActive: false,
        }

        const user = await this.usersService.create(newUser)
        user.password = undefined
        user.verifyToken = undefined
        return user
    }

    async verifyByToken(token: string): Promise<IUser> {
        const user = await this.usersService.findByToken(token)
        if (user) {
            return await this.usersService.update(user._id, { isActive: true, verifyToken: '' })
        }
        return null
    }

    async login(user: IUser): Promise<LoginResult> {
        const accessToken = await this.createAccessToken(user)
        const refreshToken = '' // todo

        return { user, accessToken, refreshToken }
    }

    async forgotPassword(email: string): Promise<IUser> {
        const user = await this.usersService.findByEmail(email)
        if (user) {
            const verifyToken = this.createVerifyToken()
            return await this.usersService.update(user._id, { isActive: false, verifyToken })
        }
        return null
    }

    async resetPassword(token: string, password: string, passwordConfirm: string): Promise<IUser> {
        const user = await this.usersService.findByToken(token)
        if (!user) {
            throw new UnauthorizedException('Invalid token')
        }
        if (password !== passwordConfirm) {
            throw new BadRequestException('Passwords do not match')
        }
        const hashedPassword = await this.createPasswordHash(password)
        return await this.usersService.update(user._id, {
            password: hashedPassword,
            isActive: true,
            verifyToken: '',
        })
    }

    async changePassword(
        userId: string,
        password: string,
        passwordConfirm: string,
    ): Promise<IUser> {
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

    private async createAccessToken(user: IUser): Promise<string> {
        const payload: TokenPayload = {
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            sub: user._id,
        }
        return this.jwtService.sign(payload)
    }

    public async createRefreshToken(user: IUser): Promise<string> {
        const token = this.jwtService.sign(user._id, { expiresIn: '7d' })

        // remove all previous refreshToken
        await this.refreshTokenService.deleteByUserId(user._id)

        await this.refreshTokenService.create(user._id, token)

        return token
    }

    private async isEmailTaken(email: string): Promise<boolean> {
        const result = await this.usersService.findByEmail(email)
        return Boolean(result)
    }

    private createVerifyToken(): string {
        return nanoid(32)
    }
}
