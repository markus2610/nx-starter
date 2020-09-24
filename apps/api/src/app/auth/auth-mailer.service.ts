import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthMailerService {
    constructor(private mailerService: MailerService) {}

    sendAccountCreatedEmail(email: string): void {
        this.mailerService
            .sendMail({
                to: email,
                from: 'from@mail.com',
                subject: 'Account created',
                text: 'Welcome! Your account was created successfully.',
                html: '<h1>Welcome</h1><p>Your account was created successfully</p>',
            })
            .then((result) => {})
            .catch((error) => {
                console.error('TCL 🚨: Could not send email :', error)
            })
    }

    sendForgotPasswordEmail(email: string, link: string): void {
        this.mailerService
            .sendMail({
                to: email,
                from: 'from@mail.com',
                subject: 'Password reset',
                text: 'Please reset your password by clicking on this link: ' + link,
                html: `<p>Please reset your password by clicking on this link: ${link}</p>`,
            })
            .then((result) => {})
            .catch((error) => {
                console.error('TCL 🚨: Could not send email :', error)
            })
    }
}
