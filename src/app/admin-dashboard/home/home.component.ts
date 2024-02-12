import { Component } from '@angular/core';
import { UserService } from '@core/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public dashboardData: any = [];
  public isLoading = false;
  constructor(
    private userServices: UserService
  ) { }
  ngOnInit(): void {
    this.getDashboardData()
  }

  getDashboardData() {
    this.isLoading = true;
    try {
      this.userServices.dashborad().subscribe(
        (response: any) => {
          if (response.status === true) {
            this.isLoading = false;
            this.dashboardData = response.data;
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }

}
