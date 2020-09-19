import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'

@NgModule({
    declarations: [LoginComponent, RegisterComponent],
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
                path: 'register',
                component: RegisterComponent,
                pathMatch: 'full',
            },
        ]),
    ],
})
export class ClientAuthModule {}
