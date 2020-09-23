import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common'
import { IUser, LoginResult } from '@nx-starter/shared-models'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: CreateUserDto): Promise<IUser> {
        return this.authService.signup(dto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<LoginResult> {
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req): Promise<void> {
        return this.authService.logout(req.user)
    }

    @Get('verify')
    async verifyUser(@Query('token') verifyToken: string): Promise<boolean> {
        try {
            await this.authService.verifyByToken(verifyToken)
            return true
        } catch (error) {
            return false
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
        const user = await this.authService.generateVerifyTokenAndDisableUser(dto.email)
        console.log('TCL: Token', user.verifyToken)
        if (!user) {
            throw new BadRequestException('No user with that email was found')
        }
        return
    }

    @Post('reset-password/:token')
    async resetPassword(
        @Body() dto: ResetPasswordDto,
        @Param('token') token: string,
    ): Promise<void> {
        const user = await this.authService.resetPassword(token, dto.password, dto.passwordConfirm)
        if (!user) {
            throw new InternalServerErrorException('No user with that email was found')
        }
        return
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() dto: ResetPasswordDto): Promise<void> {
        const user = await this.authService.changePassword(
            req.user.userId,
            dto.password,
            dto.passwordConfirm,
        )
        if (!user) {
            throw new InternalServerErrorException('No user with that email was found')
        }
        return
    }

    @Post('token')
    async getNewToken(
        @Request() req,
        @Body() dto: { refreshToken: string },
    ): Promise<{ accessToken: string }> {
        const token = await this.authService.getNewAccessToken(dto.refreshToken)

        return { accessToken: token }
    }
}
