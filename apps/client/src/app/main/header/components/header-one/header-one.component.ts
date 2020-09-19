import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { User } from '@nx-starter/api-interfaces'
import { Observable } from 'rxjs'
import { AuthService } from '../../../auth/services/auth.service'

@Component({
    selector: 'nx-starter-header-one',
    templateUrl: './header-one.component.html',
    styleUrls: ['./header-one.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderOneComponent implements OnInit {
    currentUser$: Observable<User>

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.currentUser$ = this.authService.user$
    }
}
