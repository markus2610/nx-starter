import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'

@NgModule({
    declarations: [LoginComponent],
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
        ]),
    ],
})
export class ClientAuthModule {}
