import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ManageComponent } from './manage/manage.component';
import { ClientComponent } from './client/client.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { DemoMaterialModule } from './material-module';
import { ConfirmationModelComponent } from './confirmation-model/confirmation-model.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ManageComponent,
    ClientComponent,
    ConfirmationModelComponent,
    
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DemoMaterialModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  providers:[DemoMaterialModule,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  ]
})
export class AdminDashboardModule { }
