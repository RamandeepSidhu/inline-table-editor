import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorization = '';
    if (localStorage.getItem('auth_token') !== null) {
      authorization = localStorage.getItem('auth_token') || '';
    }
    if (authorization) {
      try {
        jwtDecode(authorization, { header: true });
        const token: any = jwtDecode(authorization);
        if (token && token.exp * 1000 < Date.now()) {
          this.router.navigate(['/login']);
          localStorage.clear();
          return throwError('Token expired');
        }
      } catch (error) {
        console.log(error, 'error');
        this.router.navigate(['/login']);
        localStorage.clear();
        return throwError('Token decoding error');
      }
    }

    let headers = new HttpHeaders({
      accept: 'application/json',
      'Access-Control-Allow-Origin': '"*"',
      token:`${authorization}`
    });

    if (!request.headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    } else {
      headers = headers.set('accept', '*/*');
    }
    const clonedRequest = request.clone({ headers });
    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === false ) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
