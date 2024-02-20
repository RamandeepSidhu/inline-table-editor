import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ScopeEnum } from 'src/app/core/enums/login-status.code.enum';
import { LoginModel } from 'src/app/core/models/login.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public isPassword: boolean = true;
  public passwordType = 'password';
  public isFocused = false;
  public isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private toaster: ToastrService,
  ) { }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const submittedForm: any = this.loginForm.value as LoginModel;
      this.isLoading = true;
      this.authService.login(submittedForm).subscribe(
        (response: any) => {
          if (response.status === true) {
            this.toaster.success(response.message, 'Success');
            this.isLoading = false;
            const adminLogin = response.data;
            const hasScope = adminLogin.role === ScopeEnum.scope_id1;
            if (hasScope) {
              localStorage.setItem('auth_token', response.token);
              this.router.navigate(['/dashboard']);
            }
          }
          else {
            this.isLoading = false;
            this.toaster.error(response.message, 'Error');
          }
        }
      );
    }
  }
  passwordHideShow(type: string) {
    if (type === 'password') {
      this.ngZone.run(() => {
        this.isPassword = !this.isPassword;
        this.passwordType = this.isPassword ? 'password' : 'text';
      });
    }
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.passwordHideShow('password');
    }
  }
}