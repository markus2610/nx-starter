import { Injectable } from '@nestjs/common'

export type User = any

@Injectable()
export class UsersService {
    private readonly users: User[]

    constructor() {
        this.users = [
            {
                userId: 1,
                username: 'john',
                email: 'a@b.c',
                password: 'changeme',
            },
            {
                userId: 2,
                username: 'chris',
                email: 'b@b.c',
                password: 'secret',
            },
            {
                userId: 3,
                username: 'maria',
                email: 'c@b.c',
                password: 'guess',
            },
        ]
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.users.find((user) => user.email === email)
    }
}
