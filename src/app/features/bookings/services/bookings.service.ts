import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.model';
import {
  AvailabilitySlot,
  Booking,
  CreateBookingRequest,
} from '../../../shared/models/booking.model';
import type { BookingStatus } from '../../../shared/models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private readonly http = inject(HttpClient);
  private readonly base = 'bookings';

  getAvailability(courtId: number, date: string): Observable<ApiResponse<AvailabilitySlot[]>> {
    const params = new HttpParams().set('courtId', courtId).set('date', date);
    return this.http.get<ApiResponse<AvailabilitySlot[]>>(`${this.base}/availability`, {
      params,
    });
  }

  list(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(this.base);
  }

  create(body: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.base, body);
  }

  updateStatus(
    id: number,
    status: Exclude<BookingStatus, 'Pending'>,
    notes?: string,
  ): Observable<ApiResponse<Booking>> {
    let params = new HttpParams().set('status', status);
    if (notes) params = params.set('notes', notes);
    return this.http.put<ApiResponse<Booking>>(`${this.base}/${id}/status`, null, {
      params,
    });
  }
}