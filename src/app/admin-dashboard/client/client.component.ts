import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

export interface PeriodicElement {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  plateform: string;
  lead_score: string;
  country: string;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  paginatorList!: HTMLCollectionOf<Element>;
  idx!: number;
  dataSource: any = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  VOForm!: FormGroup;
  isEditableNew: boolean = true;
  public users: any = [];
  public countries: any = [];
  public leadScores: any = [];
  public plateforms: any = [];
  public pageSizeOptions:any =[];
  public submitted = false;
  public pageSize:number =10;
  selection = new SelectionModel<PeriodicElement>(true, []);
  displayedColumns: string[] = [
    'action',
    'name',
    'email',
    'phone',
    'linkedin',
    'plateform',
    'lead_score',
    'country',
  ];
  constructor(
    private fb: FormBuilder,
    private _formBuilder: FormBuilder,
    private userServices: UserService,
    private toaster: ToastrService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.getManageData();
    this.getUsers();
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });
    this.formload();
  }

  formload() {
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.users.map((val: any) =>
          this.fb.group({
            email: new FormControl(val.email, [
              Validators.required,
              Validators.email,
            ]),
            plateform: new FormControl({
              value: val.plateform,
              disabled: true,
            }),
            lead_score: new FormControl({
              value: val.lead_score,
              disabled: true,
            }),
            country: new FormControl({ value: val.country, disabled: true }),
            linkedin: new FormControl(val.linkedin, [
              Validators.pattern('https?://(www\.)?linkedin\.com/in/.+'),
            ]),
            name: new FormControl(val.name, [Validators.required]),
            phone: new FormControl(val.phone),
            id: new FormControl(val._id),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
        )
      ),
    });
    this.dataSource = new MatTableDataSource(
      (this.VOForm.get('VORows') as FormArray).controls
    );
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter: any) => {
      return filterPredicate.call(this.dataSource, data.value, filter);
    };
  }

  getUsers(params?: any) {
    this.isLoading = true;
    try {
      this.userServices.getUsers(params).subscribe((response: any) => {
        if (response.status === true) {
          this.users = response.data;
          this.isLoading = false;
          this.formload();
          this.updateIndex();
        }
      });
    } catch (error) {
      this.isLoading = false;
    }
  }

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName(
      'mat-paginator-range-label'
    );

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => {
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.updateIndex();
  }

  AddNewRow() {
    const data = this.VOForm.get('VORows')?.value.filter(
      (e: any) => e.isNewRow
    );
    if (data.length !== 0) {
      this.toaster.error('Please fill the first row', 'Error');
      return;
    }
    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0, this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls);
    this.dataSource.paginator = this.paginator;
    this.updateIndex();
  }

  // this function will enabled the select field for editd
  EditSVO(VOFormElement: any, i: any) {
    // const i = this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).findIndex( (obj:any) => obj === element);
    const formdata = VOFormElement.get('VORows').at(i);
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    formdata.get('isEditable').patchValue(false);
    formdata.controls['country'].enable();
    formdata.controls['plateform'].enable();
    formdata.controls['lead_score'].enable();
    // this.isEditableNew = true;
  }

  updateClient(VOFormElement: any, i: any) {
    // const i = this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).findIndex( (obj:any) => obj === element);
    const formData = VOFormElement.get('VORows').at(i);
    this.submitted = true;
    if (!formData.valid) {
      this.toaster.error('Please fill the required field', 'Error');
      return;
    }
    formData.get('isEditable').patchValue(true);
    const formValue = formData.value;
    this.formDisable(formData);
    this.isLoading = true;
    const payload = Object.keys(formValue)
      .filter((key) => formValue[key] !== '' && formValue[key] !== null)
      .reduce((obj: any, key) => {
        obj[key] = formValue[key];
        return obj;
      }, {});
    this.userServices
      .userUpdate(formData.value.id, payload)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.submitted = false;
        if (response.status === true) {
          this.getUsers();
        } else {
          this.toaster.error(response.message, 'Error');
        }
      });
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement: any, i: any) {
    // const i = this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).findIndex( (obj:any) => obj === element);
    const formData = VOFormElement.get('VORows').at(i);
    const user = this.users[i];
    formData.get('isEditable').patchValue(true);
    if (formData.value.isNewRow) {
      const control = this.VOForm.get('VORows') as FormArray;
      control.removeAt(i);
      this.dataSource = new MatTableDataSource(control.controls);
      this.dataSource.paginator = this.paginator;
      this.updateIndex();
    } else {
      formData.get('country').patchValue(user.country);
      formData.get('plateform').patchValue(user.plateform);
      formData.get('lead_score').patchValue(user.lead_score);
      formData.get('name').patchValue(user.name);
      formData.get('email').patchValue(user.email);
      formData.get('phone').patchValue(user.phone);
      formData.get('linkedin').patchValue(user.linkedin);
    }
    this.formDisable(formData);
  }

  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx: any) => {
        let from = paginator.pageSize * paginator.pageIndex + 1;

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`;
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1) list[0].innerHTML = rows;
      },
      0,
      paginator.pageIndex
    );
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      linkedin: new FormControl('', [
        Validators.pattern('^https://www.linkedin.com/.*$'),
      ]),
      country: new FormControl(''),
      plateform: new FormControl(''),
      lead_score: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      phone: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
      id: new FormControl(''),
    });
  }

  getManageData() {
    try {
      this.userServices.getManageUser('country').subscribe((response: any) => {
        if (response.status === true) {
          this.countries = response.data;
        }
      });
      this.userServices
        .getManageUser('leadscore')
        .subscribe((response: any) => {
          if (response.status === true) {
            this.leadScores = response.data;
          }
        });
      this.userServices.getManageUser('platform').subscribe((response: any) => {
        if (response.status === true) {
          this.plateforms = response.data;
        }
      });
    } catch (error) {
      this.isLoading = false;
    }
  }

  addNewRecord(VOFormElement: any, i: any) {
    // const i = this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).findIndex( (obj:any) => obj === element);
    const formData = VOFormElement.get('VORows').at(i);
    this.submitted = true;
    if (!formData.valid) {
      this.toaster.error('Please fill the required field', 'Error');
      return;
    }
    const formValue = formData.value;
    this.isLoading = true;
    const payload = Object.keys(formValue)
      .filter((key) => formValue[key] !== '' && formValue[key] !== null)
      .reduce((obj: any, key) => {
        obj[key] = formValue[key];
        return obj;
      }, {});
    this.userServices.usersCreate(payload).subscribe((response: any) => {
      this.isLoading = false;
      this.submitted = false;
      if (response.status === true) {
        this.getUsers();
      } else {
        this.toaster.error(response.message, 'Error');
      }
    });
  }

  errorMeessage(VOFormElement: any, i: any, item: string, error: string) {
    return (
      this.submitted &&
      VOFormElement.get('VORows').at(i).get(item)?.errors &&
      VOFormElement.get('VORows').at(i).get(item)?.errors[error]
    );
  }

  deleteUser(VOFormElement: any, i: any) {
    // const i = this.dataSource.sortData(this.dataSource.filteredData,this.dataSource.sort).findIndex( (obj:any) => obj === element);
    const formData = VOFormElement.get('VORows').at(i).value;
    this.isLoading = true;
    this.userServices.removeUser(formData.id).subscribe((response: any) => {
      this.isLoading = false;
      if (response.status === true) {
        this.toaster.success(response.message, 'Success');
        this.users.splice(i, 1);
        this.formload();
        this.updateIndex();
      } else {
        this.toaster.error(response.message, 'Error');
      }
    });
  }

  formDisable(formData: any) {
    formData.controls['country'].disable();
    formData.controls['plateform'].disable();
    formData.controls['lead_score'].disable();
  }

  updateIndex(): void {
    this.dataSource.data.forEach((item: any, index: number) => {
      item.index = index;
    });
    this.calculatePageSizeOptions();
  }
  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }
  calculatePageSizeOptions() {
    this.pageSizeOptions =[];
    const dataLength = this.dataSource.data.length;
    const base = 2;
    let option = this.pageSize;
    while (option < dataLength) {
      this.pageSizeOptions.push(option);
      option *= base;
    }
    this.pageSizeOptions.push(dataLength);
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  multipleRecordDelete(){
    const ids = this.selection.selected.map((e:any)=>e.value.id);
    this.isLoading = true;
    try {
      this.userServices.multipleUsersDelete({ids:ids}).subscribe((response: any) => {
        this.isLoading = false;
        if(response.status === true){
          this.getUsers();
          this.selection.clear();
        }
      });
    } catch (error) {
      this.isLoading = false;
    }
  }
}
