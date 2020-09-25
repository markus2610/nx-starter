import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { EUserRole } from '@nx-starter/shared-models'
import { Observable } from 'rxjs'

@Injectable()
export class SuperAdminGuard extends AuthGuard('jwt') implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context)
    }

    handleRequest(err, user, info) {
        if (!user) {
            throw new UnauthorizedException()
        }

        switch (user.role) {
            case EUserRole.SuperAdmin:
                break

            case EUserRole.Admin:
            case EUserRole.User:
            default:
                throw new UnauthorizedException()
        }

        return user
    }
}
