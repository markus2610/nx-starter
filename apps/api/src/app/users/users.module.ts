import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ModelNames, UserSchema } from '@nx-starter/api-models'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: ModelNames.User, schema: UserSchema }])],
    providers: [UsersService],
    exports: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
