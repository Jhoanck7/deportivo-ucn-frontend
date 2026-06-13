import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import { CreateAthleteRequest, Athlete } from '../../../shared/models/athlete.model';

@Injectable({ providedIn: 'root' })
export class AthletesService {
    private readonly http = inject(HttpClient);
    private readonly base = 'athletes';

    list(): Observable<ApiResponse<Athlete[]>> {
        return this.http.get<ApiResponse<Athlete[]>>(this.base);
    }

    create(body: CreateAthleteRequest): Observable<ApiResponse<unknown>> {
        return this.http.post<ApiResponse<unknown>>(this.base, body);
    }
}