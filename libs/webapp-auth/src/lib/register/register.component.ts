import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthService } from '@nx-starter/webapp-models'

@Component({
    selector: 'nx-starter-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup
    loading = false
    hasAgreed = false

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.defineForm()
    }

    ngOnInit(): void {}

    signUp() {
        console.log('TCL: here :') // ! remove
        this.loading = true
        const value = this.registerForm.value
        this.authService.signup(value).subscribe((v) => {
            this.loading = false
            this.router.navigate(['/'])
        })
    }

    toggleHasAgreed(): void {
        this.hasAgreed = !this.hasAgreed
    }

    private defineForm() {
        this.registerForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
            firstName: '',
            lastName: '',
        })
    }
}
