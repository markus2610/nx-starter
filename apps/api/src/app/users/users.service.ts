import { Injectable } from '@nestjs/common'
import { User, UserRole } from '@nx-starter/api-interfaces'
import * as passport from 'passport'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService {
    private readonly users: User[]

    constructor() {
        this.users = [
            {
                _id: '1',
                firstName: 'john',
                lastName: 'john',
                email: 'a@b.c',
                password: 'changeme',
                role: UserRole.User,
                verifyToken: '',
                isActive: true,
            },
            {
                _id: '2',
                firstName: 'chris',
                lastName: 'chris',
                email: 'b@b.c',
                password: 'secret',
                role: UserRole.User,
                verifyToken: '',
                isActive: true,
            },
            {
                _id: '3',
                firstName: 'maria',
                lastName: 'maria',
                email: 'c@b.c',
                password: 'guess',
                role: UserRole.User,
                verifyToken: '',
                isActive: true,
            },
        ]
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find((user) => user.email === email)
    }

    async create(user: User): Promise<Omit<User, 'password'>> {
        this.users.push(user)

        const { password, ...sanitizedUser } = user
        console.log('TCL: UsersService -> user', user)
        return sanitizedUser
    }
}
