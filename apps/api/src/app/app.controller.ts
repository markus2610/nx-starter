import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Message } from '@nx-starter/api-interfaces'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/local-auth.guard'

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('hello')
    getData(): Message {
        return this.appService.getData()
    }

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        return req.user
    }
}
