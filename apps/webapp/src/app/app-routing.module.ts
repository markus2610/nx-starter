import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'auth',
        loadChildren: () => import('@nx-starter/client/auth').then((m) => m.ClientAuthModule),
    },
    {
        path: 'user',
        loadChildren: () => import('@nx-starter/client/user').then((m) => m.ClientUserModule),
    },
    {
        path: 'page-not-found',
        loadChildren: () =>
            import('./pages/page-not-found/page-not-found.module').then(
                (m) => m.PageNotFoundModule,
            ),
    },
    { path: 'login', redirectTo: 'auth/login' },
    { path: 'logout', redirectTo: 'auth/logout' },
    { path: 'register', redirectTo: 'auth/register' },
    { path: '**', redirectTo: 'page-not-found' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
