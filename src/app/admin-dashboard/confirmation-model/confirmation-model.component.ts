import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-model',
  templateUrl: './confirmation-model.component.html',
  styleUrls: ['./confirmation-model.component.scss']
})
export class ConfirmationModelComponent {
  @Output() removeConfirmed = new EventEmitter<void>();
  constructor(public dialogRef: MatDialogRef<ConfirmationModelComponent>) {}
  onRemoveConfirmed(): void {
    this.removeConfirmed.emit();
    this.dialogRef.close();
  }
}
