import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';
declare var $: any;

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent {
  public rows: any;
  public id: String = '';
  public title: String = 'Country';
  public form!: FormGroup;
  public data: any = [];
  public isLoading = false;
  public submitted = false;
  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}
  ngOnInit(): void {
    this.getData(this.title);
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  generateRows(): void {}

  tabClick(tab: string) {
    this.title = tab;
    this.getData(tab);
  }

  getData(params = this.title) {
    this.isLoading = true;
    try {
      this.userServices.getManageUser(params).subscribe((response: any) => {
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
    (window as any).confirmDelete = this.confirmDelete.bind(this);
  }

  tableData(): string {
    if (this.data.length === 0) {
      return `<div class="card table-responsive manage-table">
                <table class="table">
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Title</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                    <td colspan="5">
                    <div class="col-12 text-center">
                    <img src="assets/icons/EmptyState.svg">
                    <h5>No records found</h5>
                    </div>
                </td>                
                    </tr>
                  </tbody>
                </table>
              </div>`;
    }
    return `<div class="card table-responsive manage-table">
      <table class="table">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          ${this.data
            .map(
              (item: any, index: any) => `
            <tr>
              <td>${index + 1}</td>
              <td>${item.title}</td>
              <td>
               <button type="button" class="viewData" onClick="viewData(${index})"><span class="material-icons" style="color:#5D5FEF;">edit</span></button>
               <button type="button" class="manageDelete" onClick="confirmDelete(${index})"><span class="material-icons" style="color:#fd4237;">delete_forever</span></button>
              </td>
            </tr>`
            )
            .join('')}
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
      this.toaster.warning('The title field is required', 'Warning');
      return;
    }
    const type: String = this.title;
    this.userServices
      .storeAndUpdateManageUser(payload, type, this.id)
      .subscribe((response: any) => {
        this.isLoading = false;
        if (response.status === true) {
          this.submitted = false;
          this.id = '';
          this.toaster.success(response.message, 'Success');
          this.form.reset();
          $('#newRecord').modal('hide');
          this.getData(this.title);
        } else {
          this.toaster.error(response.message, 'Error');
        }
      });
  }

  manageDelete(index: number) {
    const id = this.data[index]._id;
    this.isLoading = true;
    this.userServices
      .deleteManageUser(this.title, id)
      .subscribe((response: any) => {
        if (response.status === true) {
          $('#removeData').modal('hide');
          this.toaster.success(response.message, 'Success');
          console.log(response.message);
          this.data.splice(index, 1);
          this.rows = this.sanitizer.bypassSecurityTrustHtml(this.tableData());
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toaster.error(response.message, 'Error');
        }
      });
  }
  private currentIndexToDelete: number | null = null;

  confirmDelete(index?: number) {
    if (index !== undefined) {
      this.currentIndexToDelete = index;
      $('#removeData').modal('show');
    } else if (this.currentIndexToDelete !== null) {
      this.manageDelete(this.currentIndexToDelete);
      this.currentIndexToDelete = null;
    }
  }
}
