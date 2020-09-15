import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ModelNames, UserSchema } from '@nx-starter/mongo-models'

@Module({
    imports: [MongooseModule.forFeature([{ name: ModelNames.User, schema: UserSchema }])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
