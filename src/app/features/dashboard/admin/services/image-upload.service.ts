import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';

export interface ImageUploadResponse {
  id: string;
  url: string;
  fileName: string;
  contentType: string;
  uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ImageUploadService {
  private readonly http = inject(HttpClient);
  private readonly base = 'images';

  upload(file: File): Observable<ApiResponse<ImageUploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<ImageUploadResponse>>(`${this.base}/upload`, formData);
  }
}
