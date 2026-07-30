import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  AuthUserData,
  LoginRequest,
  RegisterRequest,
  UserProfile,
} from '../../../core/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'auth';

  login(body: LoginRequest): Observable<ApiResponse<AuthUserData>> {
    return this.http.post<ApiResponse<AuthUserData>>(`${this.base}/login`, body);
  }

  register(body: RegisterRequest): Observable<ApiResponse<AuthUserData>> {
    return this.http.post<ApiResponse<AuthUserData>>(`${this.base}/register`, body);
  }

  getUserById(id: number): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.base}/users/${id}`);
  }

  googleLogin(idToken: string): Observable<ApiResponse<AuthUserData>> {
    return this.http.post<ApiResponse<AuthUserData>>(`${this.base}/google`, { idToken });
  }
}