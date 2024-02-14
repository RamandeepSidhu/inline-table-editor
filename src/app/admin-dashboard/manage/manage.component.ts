import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';
declare var $: any;

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {
  public rows: any;
  public id: String = '';
  public title: String = 'Country';
  public form!: FormGroup;
  public data: any = [];
  public isLoading = false;
  public submitted = false
  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.getData(this.title);
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  generateRows(): void {
  }

  tabClick(tab: string) {
    this.title = tab;
    this.getData(tab);
  }

  getData(params = this.title) {
    this.isLoading = true;
    try {
      this.userServices.getManageUser(params).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.isLoading = false;
            this.data = response.data;
            this.rows = this.sanitizer.bypassSecurityTrustHtml(this.tableData());
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }

  ngAfterViewInit() {
    (window as any).viewData = this.viewData.bind(this);
    (window as any).manageDelete = this.manageDelete.bind(this);
  }

  tableData(): string {
    return `<div class="card table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map((item: any, index: any) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.title}</td>
              <td>
               <button type="button" style="border:0; background:transparent"  onClick="viewData(${index})"><span class="material-icons" style="color:gray;">edit</span></button>
               <button type="button"  style="border:0; background:transparent" onClick="manageDelete(${index})"><span class="material-icons" style="color:#fd4237;">delete_forever</span></button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }

  viewData(index: any) {
    const item = this.data[index];
    this.id = item._id;
    this.form.get('title')?.patchValue(item.title);
    $('#newRecord').modal('show');
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted = true;
    const payload = this.form.value;
    if (!this.form.valid) {
      this.toaster.warning("The title field is required", 'Warning');
      return;
    }
    const type: String = this.title;
    this.userServices.storeAndUpdateManageUser(payload, type, this.id).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response.status === true) {
          this.submitted = false;
          this.id = '';
          this.toaster.success(response.message, 'Success');
          this.form.reset();
          $('#newRecord').modal('hide');
          this.getData(this.title);
        }
        else {
          this.toaster.error(response.message, 'Error');
        }
      },
    );
  }

  manageDelete(index:number) {
    const id = this.data[index]._id;
    this.isLoading = true;
    this.userServices.deleteManageUser(this.title,id).subscribe(
      (response: any) => {
        if (response.status === true) {
          this.toaster.success(response.message, 'Success');
          this.data.splice(index, 1);
          this.rows = this.sanitizer.bypassSecurityTrustHtml(this.tableData());
          this.isLoading = false;
        }
        else {
          this.isLoading = false;
          this.toaster.error(response.message, 'Error');
        }
      },
    );
  }
}
