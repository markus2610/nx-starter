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
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators'

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private isRefreshing = false
    private refreshToken$$: BehaviorSubject<any> = new BehaviorSubject<any>(null)

    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                headers: request.headers.set('Content-Type', 'application/json'),
            })
        }

        request = this.addToken(request)

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error && error.status === 401) {
                    return this.handleUnauthorizedError(request, next)
                } else {
                    // TODO add toaster
                    return throwError(error)
                }
            }),
        )
    }

    private addToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
        if (!this.authService.currentTokenValue) {
            return request
        }
        // If you are calling an outside domain then do not add the token.
        // if (!request.url.match(/www.mydomain.com\//)) {
        //     return request
        // }
        return request.clone({
            headers: request.headers.set(
                'Authorization',
                `Bearer ${this.authService.currentTokenValue}`,
            ),
        })
    }

    private handleUnauthorizedError(request: HttpRequest<unknown>, next: HttpHandler) {
        if (this.isRefreshing) {
            return this.refreshToken$$.pipe(
                filter((token) => token !== null),
                take(1),
                switchMap(() => next.handle(this.addToken(request))),
            )
        } else {
            this.isRefreshing = true
            this.refreshToken$$.next(null)

            return this.authService.getNewAccessToken$().pipe(
                switchMap(({ accessToken }) => {
                    this.refreshToken$$.next(accessToken)
                    return next.handle(this.addToken(request))
                }),
                finalize(() => (this.isRefreshing = false)),
            )
        }
    }
}
