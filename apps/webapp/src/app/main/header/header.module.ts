import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { HeaderOneComponent } from './components/header-one/header-one.component'

@NgModule({
    declarations: [HeaderOneComponent],
    imports: [CommonModule, RouterModule],
    exports: [HeaderOneComponent],
})
export class HeaderModule {}
