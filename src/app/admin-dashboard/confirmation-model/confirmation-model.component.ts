import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-model',
  templateUrl: './confirmation-model.component.html',
  styleUrls: ['./confirmation-model.component.scss'],
})
export class ConfirmationModelComponent {
  @Output() alert = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  onRemoveConfirmed(): void {
    this.alert.emit();
    this.dialogRef.close();
  }
  logout() {
    this.alert.emit();
    this.dialogRef.close();
  }
}
