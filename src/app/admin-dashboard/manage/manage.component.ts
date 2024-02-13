import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';
declare var $: any;

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {
  public rows:any;
  public title:String ='Country';
  public form!: FormGroup;
  public data: any = [];
  public isLoading = false;
  public submitted = false
  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.getData(this.title);
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  tabClick(tab: string) {
    this.title = tab;
    this.getData(tab);
  }

  getData(params=this.title) {
    this.isLoading = true;
    try {
      this.userServices.getManageUser(params).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.isLoading = false;
            this.data = response.data;
            this.tableData();
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }
  getByIdUsers(userId: any) {
    this.userServices.getByIdManageUser(userId,this.title).subscribe((response: any) => {
      console.log(response);
    });
  }
  tableData() {
    this.rows = `<div class="card table-responsive">
          <table class="table table-sm table-hover">
              <thead>
                  <tr>
                      <th>Sl No.</th> 
                      <th>Title</th>
                      <th>Action</th>
                  </tr>
              </thead>
              <tbody>
            ${this.data.map((user:any, index:any) => `
              <tr>
                <td>${index + 1}</td>
                <td>${user.title}</td>
                <td>
                <button type="button" (click)="updateManageUser(${index})">  
                              <span class="material-icons check_circle" >edit</span>
                </button>
                </td>
              </tr>`).join('')}
          </tbody>
          </table>
    </div>`

  }
  updateManageUser(index:any){
    console.log('Edit clicked for index:', index);
    const payload = this.form.value;
    // if (this.data) {
    //   console.log(this.data);
    //   this.submitted = false;
    //   const id = this.data._id;
    //   this.userServices.updateManageUser(payload,id).subscribe(
    //     (response: any) => {
    //       if (response.status === true) {
    //         this.toaster.success(response.message, 'Success');
    //       }
    //       else{
    //         this.toaster.error(response.message, 'Error');
    //       }
    //       this.isLoading = false;
    //       this.form.reset();
    //       $('#newRecord').modal('hide');
    //       this.getData(this.title);   
    //     }
    //   );
    // }

  }
  onSubmit() {
    this.isLoading = true;
    this.submitted = true;
    const payload = this.form.value;
      if (!this.form.valid) {
        return;
      }
      const type:String=this.title;
      this.userServices.storeManageUser(payload,type).subscribe(
       (response: any) => {
         if (response.status === true) {
           this.submitted = false;
           this.toaster.success(response.message, 'Success');
           this.isLoading = false;
           this.form.reset();
           $('#newRecord').modal('hide');
           this.getData(this.title);   
         }
         else{
           this.toaster.error(response.message, 'Error');
         }
       },
     );
    }
}
