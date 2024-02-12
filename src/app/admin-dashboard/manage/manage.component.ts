import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {
  rows:any;
  title:String ='Country';
  public users: any = [];
  public isLoading = false;

  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private route: Router,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
  }

  tabClick(tab: string) {
    this.title = tab;
    this.tableData();
  }

  getUsers(params?:any) {
    this.isLoading = true;
    try {
      this.userServices.getManageUser(params).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.isLoading = false;
            this.users = response.data;
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }

  tableData() {
    this.rows = `<div class="card table-responsive">
          <table class="table table-sm table-hover">
              <thead>
                  <tr>
                      <th>Sl No.</th> 
                      <th>Title</th>
                  </tr>
              </thead>
              <tbody>
                  <td>1</td>
                  <td>test</td>
              </tbody>
          </table>
    </div>`
  }

}
