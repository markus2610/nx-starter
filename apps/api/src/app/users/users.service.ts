import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { SafeUser, User } from '@nx-starter/api-interfaces'
import { ModelNames } from '@nx-starter/mongo-models'
import { Document, Model } from 'mongoose'

@Injectable()
export class UsersService {
    constructor(@InjectModel(ModelNames.User) private userModel: Model<User & Document>) {}

    async findOne(email: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email })
        return user
    }

    async create(user: User): Promise<SafeUser> {
        const newUser = new this.userModel(user)
        const savedUser = await newUser.save()

        return this.getSafeUser(savedUser)
    }

    private getSafeUser(user: User): SafeUser {
        const { password, verifyToken, ...sanitizedUser } = user
        return sanitizedUser
    }
}
