import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }
    getUsers(params?:any): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/users`,{ params:params });
    }

    getByIdUers(id: any) {
        return this.http.get(`${this.apiUrl}/user/${id}`);
    }

    usersCreate(payload: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/user`, payload);
    }

    removeUser(id: number) {
        return this.http.delete(`${this.apiUrl}/user/${id}`);
    }
    userUpdate(_id: number, payload: any) {
        const url = `${this.apiUrl}/user/${_id}`;
        return this.http.put(url, payload);
    }
    dashborad(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dashboard`);
    }
}
