import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { IUser } from '@nx-starter/shared-models'
import { AuthService } from '@nx-starter/webapp-models'
import { Observable } from 'rxjs'

@Component({
    selector: 'nx-starter-header-one',
    templateUrl: './header-one.component.html',
    styleUrls: ['./header-one.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderOneComponent implements OnInit {
    currentUser$: Observable<IUser>

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.currentUser$ = this.authService.user$
    }
}
