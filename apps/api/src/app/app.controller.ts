import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Message } from '@nx-starter/api-interfaces'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService, private authService: AuthService) {}

    @Get('hello')
    getData(): Message {
        return this.appService.getData()
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }
}
