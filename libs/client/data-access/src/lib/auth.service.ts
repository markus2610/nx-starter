import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { IUser, LoginResult } from '@nx-starter/shared/data-access'
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs'
import { delay, finalize, map, retry, switchMap, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private currentUser$$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null)
    private currentToken$$: BehaviorSubject<string> = new BehaviorSubject<string>(
        this.getAccessToken(),
    )
    private timer: Subscription

    user$: Observable<IUser> = this.currentUser$$.asObservable()
    token$: Observable<string> = this.currentToken$$.asObservable()

    constructor(private router: Router, private http: HttpClient) {
        window.addEventListener('storage', this.storageEventListener.bind(this))
    }

    get currentUserValue(): IUser {
        return this.currentUser$$.value
    }

    get currentTokenValue(): string {
        return this.currentToken$$.value
    }

    ngOnDestroy(): void {
        window.removeEventListener('storage', this.storageEventListener.bind(this))
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

    refreshToken$(): Observable<{ accessToken: string }> {
        const refreshToken = this.getRefreshToken()
        console.log('TCL: refreshToken', refreshToken)
        if (!refreshToken) {
            this.clearStoredTokens()
            return of(null)
        }

        return this.http
            .post<{ accessToken: string }>(`/api/auth/token`, {
                refreshToken,
            })

            .pipe(
                tap(({ accessToken }) => this.storeAccessToken(accessToken)),
                tap(() => this.startTokenTimer()), // TODO
            )
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

    private getRefreshToken(): string {
        return localStorage.getItem('refresh_token')
    }

    private clearStoredTokens() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
    }

    private getTokenRemainingTime() {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            return 0
        }
        const jwtToken = JSON.parse(atob(accessToken.split('.')[1]))
        const expires = new Date(jwtToken.exp * 1000)
        return expires.getTime() - Date.now()
    }

    private startTokenTimer() {
        const timeout = this.getTokenRemainingTime()
        console.log('TCL: startTokenTimer -> timeout', timeout)
        this.timer = of(true)
            .pipe(
                delay(timeout),
                tap(() => this.refreshToken$().subscribe()),
            )
            .subscribe()
    }

    private stopTokenTimer() {
        this.timer?.unsubscribe()
    }

    private onLogoutSuccess() {
        localStorage.setItem('logout-event', 'logout' + Math.random())
        this.clearStoredTokens()
        this.stopTokenTimer()
        this.currentUser$$.next(null)
    }

    private onLoginSuccess(loginResult: LoginResult): IUser {
        this.currentUser$$.next(loginResult.user)
        this.currentToken$$.next(loginResult.accessToken)
        this.storeAccessToken(loginResult.accessToken)
        this.storeRefreshToken(loginResult.refreshToken)
        localStorage.setItem('login-event', 'login' + Math.random())
        return loginResult.user
    }

    private storageEventListener(event: StorageEvent) {
        console.log('TCL: storageEventListener -> event', event)
        if (event.storageArea === localStorage) {
            if (event.key === 'logout-event') {
                this.stopTokenTimer()
                this.currentUser$$.next(null)
            }
            if (event.key === 'login-event') {
                console.log('TCL: storageEventListener -> event.key', event.key)
                this.stopTokenTimer()
                this.http.get<IUser>(`/api/auth/me`).subscribe((user) => {
                    this.currentUser$$.next(user)
                })
            }
        }
    }
}
