import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { ClientComponent } from './client/client.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DisableControlDirective } from './disabled-form';
import { DemoMaterialModule } from './material-module';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    UsersComponent,
    ManageComponent,
    ClientComponent,
    DisableControlDirective,
    
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DemoMaterialModule
    // MatTableModule,
    // MatPaginatorModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  providers:[
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },

  ]
})
export class AdminDashboardModule { }
