import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule } from '@angular/router'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { JwtInterceptor } from './core/interceptors/jwt.interceptor'
import { UnauthorizedInterceptor } from './core/interceptors/unauthorized.interceptor'
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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UnauthorizedInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
