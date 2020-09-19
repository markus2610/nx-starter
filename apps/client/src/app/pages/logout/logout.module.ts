import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { LogoutRoutingModule } from './logout-routing.module'
import { LogoutComponent } from './logout.component'

@NgModule({
    declarations: [LogoutComponent],
    imports: [CommonModule, LogoutRoutingModule],
})
export class LogoutModule {}
