import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { ClientComponent } from './client/client.component';
const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      { path: 'dashboard', component: ClientComponent },
      { path: 'manage', component: ManageComponent },
      { path: 'client', component: ClientComponent },
      { path: '**', redirectTo: 'dashboard' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule { }
