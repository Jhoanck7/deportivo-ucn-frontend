import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { CourtsService } from '../../../../features/courts/services/court.service';
import { BookingsService } from '../../services/bookings.service';
import { CreateBookingRequest } from '../../../../shared/models/booking.model';

interface TimeSlot {
  time: string;
  hour: number;
  available: boolean;
}

interface CourtRecord {
  id: number;
  name: string;
  type: string;
  price: string;
  priceVal: number;
  icon: string;
  isFutbol: boolean;
  isTenis: boolean;
  slots: TimeSlot[];
}

@Component({
  selector: 'app-rent-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rent-page.component.html',
  styleUrl: './rent-page.component.css',
})
export class RentPageComponent implements OnInit {
  private authService = inject(AuthService);
  private courtsService = inject(CourtsService);
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;
  activeFilter = signal<'all' | 'futbol' | 'tenis'>('all');
  showAuthWarning = signal<boolean>(false);
  selectedDate = signal<string>(new Date().toISOString().split('T')[0]);

  courts = signal<CourtRecord[]>([]);
  bookingLoading = signal<boolean>(false);
  bookingSuccess = signal<string | null>(null);
  bookingError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.courtsService.list().subscribe({
      next: (courtsResponse) => {
        const courtsList = courtsResponse.data || [];
        if (courtsList.length === 0) {
          this.courts.set([]);
          return;
        }

        const availabilityRequests = courtsList.map(court => 
          this.bookingsService.getAvailability(court.id, this.selectedDate()).pipe(
            map(availResponse => {
              const slots = (availResponse.data || []).map(slot => ({
                time: `${slot.startHour.toString().padStart(2, '0')}:00`,
                hour: slot.startHour,
                available: slot.isAvailable
              }));
              return {
                id: court.id,
                name: court.name,
                type: this.getTypeDescription(court.name),
                price: `$${court.pricePerHour.toLocaleString('es-CL')}`,
                priceVal: court.pricePerHour,
                icon: this.getIcon(court.name),
                isFutbol: court.name.toLowerCase().includes('fútbol') || court.name.toLowerCase().includes('cancha 1') || court.name.toLowerCase().includes('cancha 2'),
                isTenis: court.name.toLowerCase().includes('tenis'),
                slots
              };
            })
          )
        );

        forkJoin(availabilityRequests).subscribe({
          next: (mappedCourts) => {
            this.courts.set(mappedCourts);
          },
          error: (err) => {
            console.error('Error fetching availability', err);
          }
        });
      },
      error: (err) => {
        console.error('Error listing courts', err);
      }
    });
  }

  onDateChange(newDate: string): void {
    if (newDate) {
      this.selectedDate.set(newDate);
      this.loadData();
    }
  }

  getIcon(name: string): string {
    if (name.toLowerCase().includes('tenis')) return '🎾';
    if (name.toLowerCase().includes('pádel')) return '🏸';
    return '⚽';
  }

  getImageUrl(name: string): string {
    if (name.toLowerCase().includes('tenis')) {
      return 'https://images.unsplash.com/photo-1622279457486-62dcc4a4b1fc?auto=format&fit=crop&w=600&q=80';
    }
    if (name.toLowerCase().includes('pádel') || name.toLowerCase().includes('padel')) {
      return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80';
  }

  getTypeDescription(name: string): string {
    if (name.toLowerCase().includes('tenis')) return 'Arcilla • Dobles/Singles';
    if (name.toLowerCase().includes('pádel')) return 'Cristal Panorámico • Dobles';
    return 'Pasto Sintético • Fútbol 7';
  }

  setFilter(sport: 'all' | 'futbol' | 'tenis'): void {
    this.activeFilter.set(sport);
  }

  selectSlot(court: CourtRecord, slot: TimeSlot): void {
    if (!this.isAuthenticated()) {
      this.showAuthWarning.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => this.router.navigate(['/auth/login']), 2500);
      return;
    }

    this.bookingLoading.set(true);
    this.bookingError.set(null);
    this.bookingSuccess.set(null);

    const request: CreateBookingRequest = {
      courtId: court.id,
      date: this.selectedDate(),
      startHour: slot.hour,
      depositAmount: court.priceVal
    };

    this.bookingsService.create(request).subscribe({
      next: (response) => {
        this.bookingLoading.set(false);
        this.bookingSuccess.set(`¡Reserva realizada con éxito para ${court.name} a las ${slot.time}!`);
        this.loadData(); // Refresh availability
        setTimeout(() => this.bookingSuccess.set(null), 5000);
      },
      error: (err) => {
        this.bookingLoading.set(false);
        this.bookingError.set(err.error?.message || 'Error al procesar la reserva. Intente nuevamente.');
        setTimeout(() => this.bookingError.set(null), 5000);
      }
    });
  }
}
