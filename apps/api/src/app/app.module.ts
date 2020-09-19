import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { environment } from '../environments/environment'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { UsersModule } from './users/users.module'

import * as mongoose from 'mongoose'

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: environment.production ? '.env' : '.dev.env',
            // make it true in production so that env vars are taken from the OS shell exports
            ignoreEnvFile: false,
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get('MONGODB_URI'),
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        ProfileModule,
    ],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
