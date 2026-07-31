import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute);

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
    this.checkPaymentCallback();
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

  checkPaymentCallback(): void {
    this.route.queryParams.subscribe(params => {
      const payment = params['payment'];
      const bookingId = params['bookingId'];
      
      if (payment === 'success' && bookingId) {
        this.bookingSuccess.set(`¡Pago aprobado por Webpay Plus con éxito! Tu arriendo de cancha #${bookingId} ha sido confirmado.`);
        this.loadData(); // Refresh list to show newly booked slots
        
        // Clean URL parameters
        this.router.navigate([], {
          queryParams: { payment: null, bookingId: null, token_ws: null },
          queryParamsHandling: 'merge'
        });
        
        setTimeout(() => this.bookingSuccess.set(null), 8000);
      } else if (payment === 'cancel') {
        this.bookingError.set('La transacción de pago Webpay fue cancelada.');
        this.router.navigate([], {
          queryParams: { payment: null, bookingId: null },
          queryParamsHandling: 'merge'
        });
        setTimeout(() => this.bookingError.set(null), 6000);
      }
    });
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

    // El abono obligatorio inicial es el 50% de la tarifa
    const depositAmount = court.priceVal * 0.5;

    const request: CreateBookingRequest = {
      courtId: court.id,
      date: this.selectedDate(),
      startHour: slot.hour,
      depositAmount: depositAmount
    };

    // 1. Crear la reserva en estado Pendiente
    this.bookingsService.create(request).subscribe({
      next: (response) => {
        const bookingId = response.data?.id;
        if (!bookingId) {
          this.bookingLoading.set(false);
          this.bookingError.set('Error al inicializar la reserva.');
          return;
        }

        // 2. Iniciar la transacción Webpay Plus
        this.bookingsService.initiatePayment(bookingId, 'SESSION_RENT').subscribe({
          next: (paymentRes) => {
            this.bookingLoading.set(false);
            const data = paymentRes.data;
            if (data && data.urlRedireccion && data.token) {
              if (data.urlRedireccion.startsWith('/') || !data.urlRedireccion.startsWith('http')) {
                // 3a. Redirigir al simulador local con los datos necesarios en la URL
                const apiBase = environment.apiUrl.replace('/api', '');
                const returnUrl = `${window.location.origin}/rent`;
                const courtEncoded = encodeURIComponent(data.courtName || 'Cancha');
                const redirectUrl = `${window.location.origin}${data.urlRedireccion}?token_ws=${data.token}&bookingId=${bookingId}&amount=${data.amount}&court=${courtEncoded}&returnUrl=${encodeURIComponent(returnUrl)}&apiUrl=${encodeURIComponent(apiBase)}`;
                window.location.href = redirectUrl;
              } else {
                // 3b. Redirigir a la pasarela de pagos REAL de Transbank mediante un Form POST
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.urlRedireccion;

                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'token_ws';
                input.value = data.token;

                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
              }
            } else {
              this.bookingError.set('Error al iniciar la transacción con la pasarela de Transbank.');
            }
          },
          error: (err) => {
            this.bookingLoading.set(false);
            this.bookingError.set('Error al conectar con la pasarela de pagos.');
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.bookingLoading.set(false);
        this.bookingError.set(err.error?.message || 'Error al procesar la reserva. Intente nuevamente.');
        setTimeout(() => this.bookingError.set(null), 5000);
      }
    });
  }
}
