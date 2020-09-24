import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { WebappCoreModule } from '@nx-starter/webapp-core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HeaderModule } from './main/header/header.module'

@NgModule({
    declarations: [AppComponent],
    imports: [
        // core
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        WebappCoreModule,

        // third-party

        // app
        HeaderModule,

        // routing
        AppRoutingModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
