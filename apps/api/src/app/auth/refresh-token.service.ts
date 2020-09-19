import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelNames } from '@nx-starter/api/mongo-models'
import { IRefreshToken } from '@nx-starter/shared/data-access'
import { Document, Model } from 'mongoose'

@Injectable()
export class RefreshTokenService {
    constructor(
        @InjectModel(ModelNames.RefreshToken)
        private refreshTokenModel: Model<IRefreshToken & Document>,
    ) {}

    async create(userId: string, token: string): Promise<IRefreshToken> {
        const createdToken = new this.refreshTokenModel({ userId, token })

        return await createdToken.save()
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.refreshTokenModel.deleteMany({ userId })
    }
}
