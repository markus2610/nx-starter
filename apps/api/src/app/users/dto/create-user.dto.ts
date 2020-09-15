import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
    @IsEmail()
    @MinLength(4)
    @MaxLength(63)
    email: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, {
        message: 'Password must contain letters, numbers and at least one special character',
    })
    password: string

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string
}
