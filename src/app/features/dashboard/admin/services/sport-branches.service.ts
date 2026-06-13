import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';

export interface SportBranch {
  id: number;
  name: string;
  trainingDays: string;
  trainingHours: string;
  trainingSector: string;
  athleteLimit: number;
  coachId: number | null;
}

@Injectable({ providedIn: 'root' })
export class SportBranchesService {
  private readonly http = inject(HttpClient);
  private readonly base = 'sport-branches';

  list(): Observable<ApiResponse<SportBranch[]>> {
    return this.http.get<ApiResponse<SportBranch[]>>(this.base);
  }
}
