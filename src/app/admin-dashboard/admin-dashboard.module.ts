import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ManageComponent } from './manage/manage.component';
@NgModule({
  declarations: [
    AdminDashboardComponent,
    UsersComponent,
    HeaderComponent,
    ManageComponent,
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: []
})
export class AdminDashboardModule { }
