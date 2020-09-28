import { Component, OnInit } from '@angular/core'
import { UserService } from '@nx-starter/webapp-models'

@Component({
    selector: 'nx-starter-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
    constructor(private userService: UserService) {}

    ngOnInit(): void {}
}
