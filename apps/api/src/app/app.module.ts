import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { environment } from '../environments/environment'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { ProfileModule } from './profile/profile.module'
import { UsersModule } from './users/users.module'

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
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: configService.get('MAIL_HOST'),
                    port: configService.get('MAIL_PORT'),
                    auth: {
                        user: configService.get('MAIL_USER'),
                        pass: configService.get('MAIL_PASS'),
                    },
                },
                defaults: { from: configService.get('MAIL_FROM') },
                template: {
                    dir: process.cwd() + '/templates',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
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
