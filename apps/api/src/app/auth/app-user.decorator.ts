import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IAppUser, IUser } from '@nx-starter/shared-models'

export const AppUser = createParamDecorator(
    (data, ctx: ExecutionContext): IAppUser => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    },
)
