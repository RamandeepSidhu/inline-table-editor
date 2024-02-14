import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private route: Router,
    public dialog: MatDialog
  ) { }
  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

}
