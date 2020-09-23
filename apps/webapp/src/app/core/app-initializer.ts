import { AuthService } from '@nx-starter/webapp-models'

export function appInitializer(authService: AuthService) {
    return () => authService.getNewAccessTokenAsPromise()
    // return () =>
    //     new Promise((resolve) => {
    //         console.log('refresh token on app start up')
    //         authService.getNewAccessToken$().subscribe().add(resolve)
    //     })
}
