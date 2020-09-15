import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { environment } from '../environments/environment'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: environment.production ? '.env' : '.dev.env',
            ignoreEnvFile: false, // make it true in production so that env vars are taken from the OS shell exports
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
