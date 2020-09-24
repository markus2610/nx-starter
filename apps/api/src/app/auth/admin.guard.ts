import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { EUserRole } from '@nx-starter/shared-models'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }

    handleRequest(err, user, info) {
        console.log('TCL:  err, user, info', err, user, info)
        if (!user) {
            throw new UnauthorizedException()
        }

        switch (user.role) {
            case EUserRole.SuperAdmin:
            case EUserRole.Admin:
                break

            case EUserRole.User:
            default:
                throw new UnauthorizedException()
        }

        return user
    }
}
