import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { IUser, LoginResult } from '@nx-starter/shared/data-access'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { finalize, map, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUser$$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null)
    private currentToken$$: BehaviorSubject<string> = new BehaviorSubject<string>(
        this.getAccessToken(),
    )

    user$: Observable<IUser> = this.currentUser$$.asObservable()
    token$: Observable<string> = this.currentToken$$.asObservable()

    constructor(private router: Router, private http: HttpClient) {}

    get currentUserValue(): IUser {
        return this.currentUser$$.value
    }

    get currentTokenValue(): string {
        return this.currentToken$$.value
    }

    me(): Observable<IUser> {
        return this.http.get<IUser>(`/api/auth/me`)
    }

    login(data: { email: string; password: string }): Observable<IUser> {
        return this.http
            .post<LoginResult>('/api/auth/login', data)
            .pipe(map((loginResult) => this.onLoginSuccess(loginResult)))
    }

    forgotPassword(email: string): Observable<boolean> {
        return this.http.post<boolean>('/api/auth/forgot-password', { email })
    }

    resetPassword(
        token: string,
        passwords: { password: string; passwordConfirm: string },
    ): Observable<boolean> {
        return this.http.post<boolean>(`/api/auth/reset-password/${token}`, passwords)
    }

    signup(data: {
        email: string
        password: string
        passwordConfirm: string
        firstName: string
        lastName: string
    }): Observable<IUser> {
        return this.http.post<IUser>('/api/auth/signup', data)
    }

    logout(): Observable<unknown> {
        return this.http
            .post<unknown>(`/api/auth/logout`, {})
            .pipe(finalize(() => this.onLogoutSuccess()))
    }

    verifyToken(token: string): Observable<boolean> {
        return this.http.get<boolean>(`/api/auth/verify?token=${token}`)
    }

    getNewAccessToken$(): Observable<{ accessToken: string }> {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) {
            this.clearStoredTokens()
            return of({ accessToken: null })
        }

        return this.http
            .post<{ accessToken: string }>(`/api/auth/token`, {
                refreshToken,
            })
            .pipe(
                tap(({ accessToken }) => {
                    this.storeAccessToken(accessToken)
                    this.currentToken$$.next(accessToken)
                }),
            )
    }

    getNewAccessTokenAsPromise(): Promise<{ accessToken: string }> {
        return this.getNewAccessToken$().toPromise()
    }

    private storeAccessToken(token: string): void {
        localStorage.setItem('access_token', token)
    }

    private storeRefreshToken(token: string): void {
        localStorage.setItem('refresh_token', token)
    }

    private getAccessToken(): string {
        return localStorage.getItem('access_token')
    }

    getRefreshToken(): string {
        return localStorage.getItem('refresh_token')
    }

    private clearStoredTokens() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    private getTokenRemainingTime(): number {
        const accessToken = this.getAccessToken()
        if (!accessToken) {
            return 0
        }
        const jwtToken = JSON.parse(atob(accessToken.split('.')[1]))
        const expires = new Date(jwtToken.exp * 1000)
        return expires.getTime() - Date.now()
    }

    private onLogoutSuccess() {
        this.clearStoredTokens()
        this.currentUser$$.next(null)
    }

    private onLoginSuccess(loginResult: LoginResult): IUser {
        this.currentUser$$.next(loginResult.user)
        this.currentToken$$.next(loginResult.accessToken)
        this.storeAccessToken(loginResult.accessToken)
        this.storeRefreshToken(loginResult.refreshToken)
        return loginResult.user
    }
}
