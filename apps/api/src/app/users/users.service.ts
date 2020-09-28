import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { ModelNames } from '@nx-starter/api-models'
import { IUser } from '@nx-starter/shared-models'
import { PaginationConfig, SortConfig } from '@nx-starter/shared-utils'
import { Document, Model } from 'mongoose'

@Injectable()
export class UsersService {
    constructor(@InjectModel(ModelNames.User) private userModel: Model<IUser & Document>) {}

    async find(
        query = {},
        paginationConfig: PaginationConfig,
        sortConfig: SortConfig,
    ): Promise<IUser[]> {
        return await this.userModel
            .find(query)
            .skip(paginationConfig.skip)
            .limit(paginationConfig.limit)
            .sort(sortConfig)
    }

    async findById(id: string): Promise<IUser | undefined> {
        const user = await this.userModel.findById(id)
        return user
    }

    async findByToken(token: string): Promise<IUser | undefined> {
        const user = await this.userModel.findOne({ verifyToken: token })
        return user
    }

    async findByEmail(email: string): Promise<IUser | undefined> {
        const user = await this.userModel.findOne({ email })
        return user
    }

    async create(user: IUser): Promise<IUser> {
        const newUser = new this.userModel(user)
        const savedUser = await newUser.save()

        return savedUser
    }

    async update(id: string, partial: Partial<IUser>) {
        const user = await this.userModel.findByIdAndUpdate(id, { ...partial }, { new: true })
        return user
    }
}
