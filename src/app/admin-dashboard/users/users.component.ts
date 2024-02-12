import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleEnum } from 'src/app/core/enums/role.enum';
import { UserService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent  implements OnInit {
  public users: any = [];
  public isLoading = false;
  private timeoutId: any;
  public usersData: any;
  public registrationForm!: FormGroup;
  public submitted = false;
  public isNewPassword = false;
  selectedRole:any = RoleEnum.CLIENT; 
  isEditing: boolean = false;
  isEdit: boolean=false;
  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private route: Router,
    private formBuilder: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.getUsers()
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phone:[''],
      linkedin: [''],
      role: [RoleEnum.CLIENT],
      country: ['India'],
    });
    this.registrationForm.get('role')?.valueChanges.subscribe((selectedRole: Number) => {
      this.selectedRole = selectedRole;
      if (selectedRole === RoleEnum.ADMIN) {
        this.registrationForm.get('password')?.setValidators([Validators.required]);
      } else {
        this.registrationForm.get('password')?.clearValidators();
        this.registrationForm.get('password')?.patchValue('');
      }
      this.registrationForm.get('password')?.updateValueAndValidity();
    });
  }

  getUsers(params?:any) {
    this.isLoading = true;
    try {
      this.userServices.getUsers(params).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.isLoading = false;
            this.users = response.data;
            this.users = this.users.map((user:any) => {
              const isDisabled = true;
              return {
                ...user,
                isDisabled
              };
            });
          }
        });
    } catch (error) {
      this.isLoading = false;
    }
  }
  selectRole(event:any){
    const { value } = event.target;
    this.getUsers(value?{ role:value }:'');
  }

  onSearchChange(event:any){
    const { value } = event.target;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.getUsers(value?{ name:value }:'');
    }, 500);
  }

  calculateWidth(content: string): string {
    const minWidth = '50px';
    const textLength = content ? content.length : 0;
    const width = Math.max(textLength * 10, parseInt(minWidth, 10));
    return width + 'px';
  }

  userEdit(user:any,index:number){
    this.users[index].isDisabled = false;
    this.cancelEdit();
    this.users.forEach((element: any) => {
     this.isEdit = false;
    });
    user.isEdit = true;
  }

  updateUser(user:any,index:number){
    this.users[index].isDisabled = true;
  }

  deleteUser(user:any,index:number){
    this.isLoading = true;
    this.userServices.removeUser(user._id).subscribe(
      (response: any) => {
        if (response.status === true) {
          this.toaster.success(response.message, 'Success');
          this.users.splice(index,1);
          this.isLoading = false;
        }
        else{
          this.toaster.error(response.message, 'Error');
        }
      },
    );
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  submitRegistration() {
    this.isLoading = true;
    this.submitted = true;
    const formValue = this.registrationForm.value;
    const payload = Object.keys(formValue)
      .filter(key => formValue[key] !== "" && formValue[key] !== null)
      .reduce((obj:any, key) => {
        obj[key] = formValue[key];
        return obj;
      }, {});
      if (!this.registrationForm.valid) {
        return;
      }
       this.userServices.usersCreate(payload).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.getUsers();
            this.submitted = false;
            this.toaster.success(response.message, 'Success');
            this.isLoading = false;
            this.registrationForm.reset();
            this.registrationForm.get('role')?.patchValue(RoleEnum.CLIENT);
            this.registrationForm.get('country')?.patchValue('India');
          }
          else{
            this.toaster.error(response.message, 'Error');
          }
        },
      );
  }




  addNewRecord(): void {
    const newRecord = {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      country: '',
      platform:'',
      lead_score:'',
      conversion:'',
      isEdit: true,
    };

    this.users.unshift(newRecord);
  }

  cancelEdit(): void {
    this.users.forEach((element: any) => {
      element.isEdit = false;
    });

    this.isEditing = false;
  }

}