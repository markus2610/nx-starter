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
                pathMatch: 'full',
            },
            {
                path: 'logout',
                component: LogoutComponent,
                pathMatch: 'full',
            },
            {
                path: 'register',
                component: RegisterComponent,
                pathMatch: 'full',
            },
            {
                path: 'verify',
                component: VerifyComponent,
                pathMatch: 'full',
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
                pathMatch: 'full',
            },
            {
                path: 'reset-password/:token',
                component: ResetPasswordComponent,
                pathMatch: 'full',
            },
        ]),
    ],
})
export class WebappAuthModule {}
