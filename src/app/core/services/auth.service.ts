import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginPayload {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api`;
  constructor(private http: HttpClient) { }
  getToken() {
    return localStorage.getItem('auth_token');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }
  login(payload: LoginPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, payload);
  }
}
