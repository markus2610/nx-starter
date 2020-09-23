import { AuthService } from '@nx-starter/client/data-access'

export function appInitializer(authService: AuthService) {
    return () => authService.getNewAccessTokenAsPromise()
    // return () =>
    //     new Promise((resolve) => {
    //         console.log('refresh token on app start up')
    //         authService.getNewAccessToken$().subscribe().add(resolve)
    //     })
}
