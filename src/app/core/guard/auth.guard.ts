// auth.guard.ts

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const getToken = this.authService.getToken() || '';
    if (getToken) {
      return true;
    } else {
      if (this.authService.isAuthenticated()) {
        this.router.navigate([state.url]);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
