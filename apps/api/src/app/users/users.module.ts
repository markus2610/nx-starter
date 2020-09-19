import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ModelNames, UserSchema } from '@nx-starter/api/mongo-models'
import { UsersService } from './users.service'

@Module({
    imports: [MongooseModule.forFeature([{ name: ModelNames.User, schema: UserSchema }])],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
