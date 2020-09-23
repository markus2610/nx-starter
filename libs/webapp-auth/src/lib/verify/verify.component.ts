import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Route, Router } from '@angular/router'
import { AuthService } from '@nx-starter/webapp-models'
import { filter, map, switchMap, take } from 'rxjs/operators'

@Component({
    selector: 'nx-starter-verify',
    templateUrl: './verify.component.html',
    styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap
            .pipe(
                filter((params) => params.has('token')),
                map((params) => params.get('token')),
                take(1),
                switchMap((token) => this.authService.verifyToken(token)),
            )
            .subscribe((isVerified) => {
                // TODO show success notification
                if (isVerified) {
                    console.log('TCL: SUCCESS :', isVerified) // ! remove
                    this.router.navigate(['/'])
                }
            })
    }
}
