import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthService } from '../../main/auth/services/auth.service'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const currentUser = this.authService.currentUserValue
        const currentAccessToken = this.authService.currentTokenValue
        const isLoggedIn = currentUser && currentAccessToken
        if (isLoggedIn) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentAccessToken}`,
                },
            })
        }
        return next.handle(request)
    }
}
