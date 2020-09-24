import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule, Optional, SkipSelf } from '@angular/core'
import { JwtInterceptor } from '@nx-starter/webapp-auth'

@NgModule({
    imports: [CommonModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true,
        },
    ],
})
export class WebappCoreModule {
    constructor(@Optional() @SkipSelf() core: WebappCoreModule) {
        if (core) {
            throw new Error('Core Module can only be imported to AppModule.')
        }
    }
}
