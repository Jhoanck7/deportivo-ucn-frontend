import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';
import { BanUserRequest, UserProfile } from '../../../../core/models/user.model';

@Injectable({ providedIn: 'root' })

export class AdminUsersService {

  private readonly http = inject(HttpClient);
  private readonly base = 'auth/users';

  list(): Observable<ApiResponse<UserProfile[]>> {
    
    return this.http.get<ApiResponse<UserProfile[]>>(this.base);
  }
  ban(id: number, body: BanUserRequest): Observable<ApiResponse<unknown>> {
    return this.http.put<ApiResponse<unknown>>(`${this.base}/${id}/ban`, body);
  }
}