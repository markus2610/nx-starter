import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { AuthService } from '@nx-starter/client/data-access'
import { IUser } from '@nx-starter/shared/data-access'
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
