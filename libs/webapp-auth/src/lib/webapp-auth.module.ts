import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { LoginComponent } from './login/login.component'
import { LogoutComponent } from './logout/logout.component'
import { RegisterComponent } from './register/register.component'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { VerifyComponent } from './verify/verify.component'

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        VerifyComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        LogoutComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginComponent,
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginComponent,
            },
            {
                path: 'logout',
                component: LogoutComponent,
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'verify',
                component: VerifyComponent,
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            },
            {
                path: 'reset-password/:token',
                component: ResetPasswordComponent,
            },
        ]),
    ],
})
export class WebappAuthModule {}
