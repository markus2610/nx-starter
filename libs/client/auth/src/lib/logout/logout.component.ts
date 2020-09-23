import { Component, OnInit } from '@angular/core'
import { AuthService } from '@nx-starter/client/data-access'

@Component({
    selector: 'nx-starter-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.logout().subscribe()
    }
}
