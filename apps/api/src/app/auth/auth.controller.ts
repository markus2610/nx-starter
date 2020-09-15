import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common'
import { LoginResult } from '@nx-starter/api-interfaces'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './local-auth.guard'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: CreateUserDto) {
        return this.authService.signup(dto)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<LoginResult> {
        return this.authService.login(req.user)
    }

    @Get('verify')
    async verifyUser(@Query('token') verifyToken: string) {
        return this.authService.verifyByToken(verifyToken)
    }
}
