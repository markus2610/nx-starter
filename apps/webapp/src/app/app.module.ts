import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { JwtInterceptor } from '@nx-starter/webapp-auth'
import { AuthService } from '@nx-starter/webapp-models'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { appInitializer } from './core/app-initializer'
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

        // third-party

        // app
        HeaderModule,

        // routing
        AppRoutingModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
        // {
        //     provide: APP_INITIALIZER,
        //     useFactory: appInitializer,
        //     multi: true,
        //     deps: [AuthService],
        // },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
