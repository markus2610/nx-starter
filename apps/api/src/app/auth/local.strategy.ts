import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { IUser } from '@nx-starter/shared-models'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        })
    }

    async validate(email: string, password: string): Promise<IUser> {
        return await this.authService.getAuthenticatedUser(email, password)
    }
}
