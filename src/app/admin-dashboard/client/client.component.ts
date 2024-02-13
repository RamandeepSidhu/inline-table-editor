import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/users.service';

export interface PeriodicElement {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  plateform:string;
  lead_score:string;
  country:string;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatorList!: HTMLCollectionOf<Element>;
  idx!: number;
  dataSource:any = new MatTableDataSource<any>();
  isLoading = true;
  pageNumber: number = 1;
  VOForm!: FormGroup;
  isEditableNew: boolean = true;
  public users: any = [];
  public countries: any = [];
  public leadScores: any = [];
  public plateforms: any = [];
  displayedColumns: string[] = [
    'email',
    'name',
    'phone',
    'linkedin',
    'plateform',
    'lead_score',
    'country',
    'action',
  ];
  constructor(private fb: FormBuilder, private _formBuilder: FormBuilder, private userServices: UserService,
    private toaster: ToastrService,
    private route: Router,
    private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getManageData();
    this.getUsers();
    this.VOForm = this._formBuilder.group({
      VORows: this._formBuilder.array([]),
    });
  }

  formload (){
    this.VOForm = this.fb.group({
      VORows: this.fb.array(
        this.users.map((val:any) =>
          this.fb.group({
            email: new FormControl(val.email),
            plateform: new FormControl(val.plateform),
            lead_score: new FormControl(val.lead_score),
            country: new FormControl(val.country),
            linkedin: new FormControl(val.linkedin),
            name: new FormControl(val.name),
            phone: new FormControl(val.phone),
            action: new FormControl('existingRecord'),
            isEditable: new FormControl(true),
            isNewRow: new FormControl(false),
          })
        )
      ),
    });
    this.isLoading = false;
    this.dataSource = new MatTableDataSource(
      (this.VOForm.get('VORows') as FormArray).controls
    );
    this.dataSource.paginator = this.paginator;
    const filterPredicate = this.dataSource.filterPredicate;
    this.dataSource.filterPredicate = (data: AbstractControl, filter:any) => {
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
  }

  AddNewRow() {
    const control = this.VOForm.get('VORows') as FormArray;
    control.insert(0, this.initiateVOForm());
    this.dataSource = new MatTableDataSource(control.controls);
  }

  // this function will enabled the select field for editd
  EditSVO(VOFormElement: any, i: any) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = true;
  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(VOFormElement: any, i: any) {
    // alert('SaveVO')
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(VOFormElement: any, i: any) {
    VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
  }

  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx:any) => {
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
      email: new FormControl(''),
      linkedin: new FormControl(''),
      country: new FormControl(''),
      plateform: new FormControl(''),
      lead_score: new FormControl(''),
      name: new FormControl(''),
      phone: new FormControl(''),
      action: new FormControl('newRecord'),
      isEditable: new FormControl(false),
      isNewRow: new FormControl(true),
    });
  }


  getManageData() {
    try {
      this.userServices.getManageUser('country').subscribe((response: any) => {
        if (response.status === true) {
          this.countries = response.data;
        }
      });
      this.userServices.getManageUser('leadscore').subscribe((response: any) => {
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

  
}
