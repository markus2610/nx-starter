/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import * as csurf from 'csurf'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
import { AppModule } from './app/app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(helmet())
    app.enableCors()
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        }),
    )
    // app.use(csurf())

    const globalPrefix = 'api'
    app.setGlobalPrefix(globalPrefix)
    const port = process.env.PORT || 3333
    await app.listen(port, () => {
        Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
    })
}

bootstrap()
