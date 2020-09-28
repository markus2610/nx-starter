import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TableModule } from 'primeng/table'
import { UsersListComponent } from './components/users-list/users-list.component'

@NgModule({
    imports: [CommonModule, TableModule],
    declarations: [UsersListComponent],
})
export class AdminUsersModule {}
