import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RoleEnum } from 'src/app/core/enums/role.enum';
import { UserService } from 'src/app/core/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public users: any = [];
  public isLoading = false;
  public usersData: any;
  public registrationForm!: FormGroup;
  public submitted = false;
  public updateSubmitted = false;
  public isNewPassword = false;
  isEditing: boolean = false;
  isEdit: boolean = false;
  isAddingNewRecord: boolean = false;
  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private route: Router,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.getUsers();
    this.initForm();
  }
  initForm(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      linkedin: [''],
      country: ['India'],
    });
  }
  getUsers(params?: any) {
    this.isLoading = true;
    try {
      this.userServices.getUsers(params).subscribe((response: any) => {
        if (response.status === true) {
          this.isLoading = false;
          this.users = response.data;
          this.users = this.users.map((user: any) => {
            const isDisabled = true;
            return {
              ...user,
              isDisabled,
            };
          });
        }
      });
    } catch (error) {
      this.isLoading = false;
    }
  }

  userEdit(user: any, index: number) {
    user.isEdit = true;
    user.isDisabled = false;
    this.users.forEach((element: any, i: number) => {
      if (i !== index) {
        element.isDisabled = true;
      }
    });
    this.isEdit = true;
  }

  updateUser(user: any, index: number) {
    this.updateSubmitted = false;
    if (user.name === '') {
      this.users[index].isDisabled = false;
      user.isEdit = true;
      this.updateSubmitted = true;
      this.isEdit = true;
      return;
    }
    this.users[index].isDisabled = true;
    this.registrationForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      linkedin: user.linkedin,
      country: user.country,
    });
    const payload = { ...this.registrationForm.value };
    delete payload.password;
    this.userServices
      .userUpdate(user._id, payload)
      .subscribe((response: any) => {
        if (response.status === true) {
          user.isEdit = false;
          this.isEdit = false;
          this.updateSubmitted = false;
          this.toaster.success(response.message, 'Success');
        } else {
          this.toaster.error(response.message, 'Error');
        }
        this.isLoading = false;
      });
  }

  submitRegistration() {
    this.isLoading = true;
    this.submitted = true;
    const formValue = this.registrationForm.value;
    const payload = Object.keys(formValue)
      .filter((key) => formValue[key] !== '' && formValue[key] !== null)
      .reduce((obj: any, key) => {
        obj[key] = formValue[key];
        return obj;
      }, {});
    if (!this.registrationForm.valid) {
      return;
    }
    this.userServices.usersCreate(payload).subscribe((response: any) => {
      if (response.status === true) {
        this.getUsers();
        this.submitted = false;
        this.toaster.success(response.message, 'Success');
        this.isLoading = false;
        this.registrationForm.reset();
        this.registrationForm.get('role')?.patchValue(RoleEnum.CLIENT);
        this.registrationForm.get('country')?.patchValue('India');
        this.isAddingNewRecord = false;
        this.isEdit = false;
      } else {
        this.toaster.error(response.message, 'Error');
      }
    });
  }

  deleteUser(user: any, index: number) {
    this.isLoading = true;
    this.userServices.removeUser(user._id).subscribe((response: any) => {
      if (response.status === true) {
        this.toaster.success(response.message, 'Success');
        this.users.splice(index, 1);
        this.isLoading = false;
        this.isEdit = false;
      } else {
        this.toaster.error(response.message, 'Error');
      }
    });
  }

  addNewRecord(): void {
    if (this.isEdit) {
      this.isEdit = false;
      this.users.forEach((element: any) => {
        element.isEdit = false;
      });
    }
    this.isAddingNewRecord = true;
    this.initForm();
  }
  cancel() {
    this.isAddingNewRecord = false;
    this.initForm();
  }
}
