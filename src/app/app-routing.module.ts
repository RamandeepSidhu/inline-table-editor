import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RedirectToDashboardGuard } from './core/guard/redirect-dashbaord-guard';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guard/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [RedirectToDashboardGuard] },
  {
    path: '',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then(m => m.AdminDashboardModule),canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      preloadingStrategy: PreloadAllModules
    })
  ], exports: [RouterModule],
})
export class AppRoutingModule { }
