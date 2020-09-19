import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { RefreshToken } from '@nx-starter/api-interfaces'
import { ModelNames } from '@nx-starter/mongo-models'
import { Document, Model } from 'mongoose'

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(ModelNames.RefreshToken)
        private refreshTokenModel: Model<RefreshToken & Document>,
    ) {}

    async create(userId: string, token: string): Promise<RefreshToken> {
        const createdToken = new this.refreshTokenModel({ userId, token })

        return await createdToken.save()
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.refreshTokenModel.deleteMany({ userId })
    }
}
