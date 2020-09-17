import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@nx-starter/api-interfaces'
import { ModelNames } from '@nx-starter/mongo-models'
import { Document, Model } from 'mongoose'

@Injectable()
export class UsersService {
    constructor(@InjectModel(ModelNames.User) private userModel: Model<User & Document>) {}

    async findById(id: string): Promise<User | undefined> {
        const user = await this.userModel.findById(id)
        return user
    }

    async findByToken(token: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ verifyToken: token })
        return user
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email })
        return user
    }

    async create(user: User): Promise<User> {
        const newUser = new this.userModel(user)
        const savedUser = await newUser.save()

        return savedUser
    }

    async update(id: string, partial: Partial<User>) {
        const user = await this.userModel.findByIdAndUpdate(id, { ...partial }, { new: true })
        return user
    }
}
