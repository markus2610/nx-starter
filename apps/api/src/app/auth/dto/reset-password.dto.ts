import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator'

export class ResetPasswordDto {
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, {
        message: 'Password must contain letters, numbers and at least one special character',
    })
    password: string

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/, {
        message: 'Password must contain letters, numbers and at least one special character',
    })
    passwordConfirm: string
}
