import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./pages/home/home.module').then((m) => m.HomeModule),
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginModule),
    },
    {
        path: 'logout',
        loadChildren: () => import('./pages/logout/logout.module').then((m) => m.LogoutModule),
    },
    {
        path: 'page-not-found',
        loadChildren: () =>
            import('./pages/page-not-found/page-not-found.module').then(
                (m) => m.PageNotFoundModule,
            ),
    },
    {
        path: 'register',
        loadChildren: () =>
            import('./pages/register/register.module').then((m) => m.RegisterModule),
    },
    { path: '**', redirectTo: 'page-not-found' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
