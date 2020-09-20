import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { AuthService } from '@nx-starter/client/data-access'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, switchMap, take } from 'rxjs/operators'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshing = false
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const currentAccessToken = this.authService.currentTokenValue
        if (currentAccessToken) {
            request = this.addToken(request, currentAccessToken)
        }
        return next.handle(request)

        //     .pipe(
        //     catchError((error) => {
        //         if (error instanceof HttpErrorResponse && error.status === 401) {
        //             return this.handleUnauthorizedError(request, next)
        //         } else {
        //             return throwError(error)
        //         }
        //     }),
        // )
    }

    private addToken(request: HttpRequest<unknown>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    // when a request is unauthorized, check if the jwt has expired. If so,
    // attempt to get a new token and send the failed request again
    private handleUnauthorizedError(request: HttpRequest<unknown>, next: HttpHandler) {
        console.log('TCL: this.isRefreshing :', this.isRefreshing) // ! remove
        if (!this.isRefreshing) {
            this.isRefreshing = true
            this.refreshTokenSubject.next(null)
            console.log('TCL: A :') // ! remove

            return this.authService.refreshToken$().pipe(
                take(1),
                switchMap(({ accessToken }) => {
                    this.isRefreshing = false
                    this.refreshTokenSubject.next(accessToken)
                    return next.handle(this.addToken(request, accessToken))
                }),
            )
        } else {
            console.log('TCL: B :') // ! remove
            return this.refreshTokenSubject.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap((jwt) => next.handle(this.addToken(request, jwt))),
            )
        }
    }
}
