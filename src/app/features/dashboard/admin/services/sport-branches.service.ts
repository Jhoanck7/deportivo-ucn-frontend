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

  create(branch: Omit<SportBranch, 'id' | 'coachId'> & { associatedDT?: string }): Observable<ApiResponse<SportBranch>> {
    // Map associatedDT to coachId if backend expects coachId
    const body = {
      name: branch.name,
      trainingDays: branch.trainingDays,
      trainingHours: branch.trainingHours,
      trainingSector: branch.trainingSector,
      athleteLimit: branch.athleteLimit,
      coachId: branch.associatedDT ? parseInt(branch.associatedDT) : null
    };
    return this.http.post<ApiResponse<SportBranch>>(this.base, body);
  }

  update(id: number, branch: Omit<SportBranch, 'id' | 'coachId'> & { associatedDT?: string }): Observable<ApiResponse<SportBranch>> {
    const body = {
      name: branch.name,
      trainingDays: branch.trainingDays,
      trainingHours: branch.trainingHours,
      trainingSector: branch.trainingSector,
      athleteLimit: branch.athleteLimit,
      coachId: branch.associatedDT ? parseInt(branch.associatedDT) : null
    };
    return this.http.put<ApiResponse<SportBranch>>(`${this.base}/${id}`, body);
  }

  delete(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${id}`);
  }
}
