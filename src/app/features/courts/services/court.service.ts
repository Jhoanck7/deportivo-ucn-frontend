import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Court, CreateCourtRequest } from '../../../shared/models/court.model';

@Injectable({ providedIn: 'root' })
export class CourtsService {
  private readonly http = inject(HttpClient);
  private readonly base = 'courts';

  list(): Observable<ApiResponse<Court[]>> {
    return this.http.get<ApiResponse<Court[]>>(this.base);
  }

  create(body: CreateCourtRequest): Observable<ApiResponse<Court>> {
    return this.http.post<ApiResponse<Court>>(this.base, body);
  }
}