import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { IUser, LoginResult } from '@nx-starter/shared/data-access'
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs'
import { delay, finalize, map, tap } from 'rxjs/operators'

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private currentUserSubject: BehaviorSubject<IUser>
    private currentTokenSubject: BehaviorSubject<string>
    private timer: Subscription

    user$: Observable<IUser>
    token$: Observable<string>

    constructor(private router: Router, private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<IUser>(null)
        this.currentTokenSubject = new BehaviorSubject<string>(localStorage.getItem('access_token'))
        this.user$ = this.currentUserSubject.asObservable()
        this.token$ = this.currentTokenSubject.asObservable()
        window.addEventListener('storage', this.storageEventListener.bind(this))
    }

    get currentUserValue(): IUser {
        return this.currentUserSubject.value
    }

    get currentTokenValue(): string {
        return this.currentTokenSubject.value
    }

    ngOnDestroy(): void {
        window.removeEventListener('storage', this.storageEventListener.bind(this))
    }

    me() {
        return this.http.get(`/api/auth/me`).pipe()
    }

    login(data: { email: string; password: string }): Observable<IUser> {
        return this.http
            .post<LoginResult>('/api/auth/login', data)
            .pipe(map((loginResult) => this.onLoginSuccess(loginResult)))
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
        return this.http.post<unknown>(`/api/auth/logout`, {}).pipe(
            finalize(() => {
                this.clearLocalStorage()
                this.currentUserSubject.next(null)
                this.stopTokenTimer()
            }),
        )
    }

    verifyToken(token: string): Observable<boolean> {
        return this.http.get<boolean>(`/api/auth/verify?token=${token}`)
    }

    refreshToken$(): Observable<{ accessToken: string }> {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
            this.clearLocalStorage()
            return of(null)
        }

        return this.http
            .post<{ accessToken: string }>(`/api/auth/token`, { refreshToken })
            .pipe(
                tap((data: { accessToken: string }) => {
                    this.setAccesTokenToStorage(data.accessToken)
                    this.startTokenTimer()
                }),
            )
    }

    setTokensToStorage(loginResult: LoginResult) {
        localStorage.setItem('access_token', loginResult.accessToken)
        localStorage.setItem('refresh_token', loginResult.refreshToken)
        localStorage.setItem('login-event', 'login' + Math.random())
    }

    setAccesTokenToStorage(token: string): void {
        localStorage.setItem('access_token', token)
    }

    clearLocalStorage() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.setItem('logout-event', 'logout' + Math.random())
    }

    private storageEventListener(event: StorageEvent) {
        if (event.storageArea === localStorage) {
            if (event.key === 'logout-event') {
                this.stopTokenTimer()
                this.currentUserSubject.next(null)
            }

            if (event.key === 'login-event') {
                console.log('TCL: storageEventListener -> event.key', event.key)
                this.stopTokenTimer()
                this.http.get<IUser>(`/api/auth/me`).subscribe((user) => {
                    this.currentUserSubject.next(user)
                })
            }
        }
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

    private onLoginSuccess(loginResult: LoginResult): IUser {
        this.currentUserSubject.next(loginResult.user)
        this.currentTokenSubject.next(loginResult.accessToken)
        this.setTokensToStorage(loginResult)
        localStorage.setItem('login-event', 'login' + Math.random())
        this.startTokenTimer()
        return loginResult.user
    }
}
