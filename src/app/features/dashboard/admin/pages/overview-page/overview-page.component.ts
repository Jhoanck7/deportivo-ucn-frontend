import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';
import { BookingsService } from '../../../../bookings/services/bookings.service';

interface Booking {
  id: number;
  time: string;
  court: string;
  courtSubtitle: string;
  user: string;
  rut: string;
  status: 'ABONADO' | 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';
  isContacted: boolean;
  borderColor: string;
  whatsAppLink: string;
  realStatus: string;
}

interface Activity {
  type: 'confirmada' | 'cancelada' | 'recordatorio';
  boldText: string;
  normalText: string;
  timeAgo: string;
  responsible: string;
}

interface ShiftDemand {
  shift: string;
  heightPercentage: number;
  isActive: boolean;
}

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css',
})
export class OverviewPageComponent implements OnInit {
  private http = inject(HttpClient);
  private bookingsService = inject(BookingsService);

  backendMessage = signal('');
  isBackendConnected = signal(false);
  currentPage = signal(1);
  pageSize = signal(5);
  searchQuery = signal('');
  todayBookingsCount = signal(0);
  occupiedCourtsCount = signal(0);

  totalBookings = signal<Booking[]>([]);
  filteredBookings = signal<Booking[]>([]);
  paginatedBookings = signal<Booking[]>([]);

  activities: Activity[] = [
    { type: 'confirmada', boldText: 'Reserva confirmada - Reserva #882', normalText: 'Carlos Pérez', timeAgo: 'Hace 2 minutos', responsible: 'Carlos Pérez' },
    { type: 'cancelada', boldText: 'Reserva cancelada - Cancha #2', normalText: 'Sistema Automático', timeAgo: 'Hace 15 minutos', responsible: 'Sistema Automático' },
    { type: 'recordatorio', boldText: 'Recordatorio enviado vía WhatsApp', normalText: 'Admin', timeAgo: 'Hace 32 minutos', responsible: 'Admin' },
  ];

  shiftDemands: ShiftDemand[] = [
    { shift: 'MAÑANA', heightPercentage: 40, isActive: false },
    { shift: 'MAÑANA', heightPercentage: 55, isActive: false },
    { shift: 'MEDIODÍA', heightPercentage: 65, isActive: false },
    { shift: 'MEDIODÍA', heightPercentage: 88, isActive: true },
    { shift: 'TARDE', heightPercentage: 75, isActive: false },
    { shift: 'TARDE', heightPercentage: 50, isActive: false },
    { shift: 'NOCHE', heightPercentage: 45, isActive: false },
  ];

  ngOnInit(): void {
    this.checkBackendConnection();
    this.loadBookings();
  }

  checkBackendConnection(): void {
    this.http.get<{ mensaje: string }>('test').subscribe({
      next: (response) => {
        this.backendMessage.set(response.mensaje);
        this.isBackendConnected.set(true);
      },
      error: () => {
        this.backendMessage.set('Error: No se pudo conectar al backend');
        this.isBackendConnected.set(false);
      },
    });
  }

  loadBookings(): void {
    this.bookingsService.list().subscribe({
      next: (response) => {
        const rawBookings = response.data || [];
        const mapped = rawBookings.map(b => {
          let mappedStatus: 'ABONADO' | 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO' = 'PENDIENTE';
          if (b.status === 'Confirmed') mappedStatus = 'CONFIRMADO';
          else if (b.status === 'Completed') mappedStatus = 'ABONADO';
          else if (b.status === 'Cancelled') mappedStatus = 'CANCELADO';

          let borderColor = '#ff7c60'; // tennis
          if (b.courtName.toLowerCase().includes('fútbol') || b.courtName.toLowerCase().includes('cancha 1') || b.courtName.toLowerCase().includes('cancha 2')) {
            borderColor = '#10b981';
          } else if (b.courtName.toLowerCase().includes('pádel')) {
            borderColor = '#3b82f6';
          }

          return {
            id: b.id,
            time: `${b.startHour.toString().padStart(2, '0')}:00 - ${(b.startHour + 1).toString().padStart(2, '0')}:00`,
            court: b.courtName,
            courtSubtitle: b.courtName.toLowerCase().includes('tenis') ? 'Cancha de Arcilla' : 'Cancha de Pasto Sintético',
            user: b.userFullName,
            rut: b.userPhone || 'S/N',
            status: mappedStatus,
            isContacted: false,
            borderColor,
            whatsAppLink: b.whatsAppLink,
            realStatus: b.status
          };
        });
        this.totalBookings.set(mapped);

        // Update KPIs
        const todayStr = new Date().toISOString().split('T')[0];
        this.todayBookingsCount.set(rawBookings.filter(b => b.date.startsWith(todayStr)).length);
        
        const activeCourtsToday = new Set(rawBookings.filter(b => b.date.startsWith(todayStr) && b.status !== 'Cancelled').map(b => b.courtId));
        this.occupiedCourtsCount.set(activeCourtsToday.size);

        // Add dynamically a live activity log if there's new bookings
        if (rawBookings.length > 0) {
          const latest = rawBookings[rawBookings.length - 1];
          this.activities.unshift({
            type: latest.status === 'Cancelled' ? 'cancelada' : 'confirmada',
            boldText: `Reserva ${latest.status === 'Cancelled' ? 'cancelada' : 'creada'} - ID #${latest.id}`,
            normalText: latest.userFullName,
            timeAgo: 'Hace un momento',
            responsible: latest.userFullName
          });
          if (this.activities.length > 5) this.activities.pop();
        }

        this.updateFilteringAndPagination();
      },
      error: (err) => {
        console.error('Error loading bookings', err);
      }
    });
  }

  updateFilteringAndPagination(): void {
    let list = this.totalBookings();
    const query = this.searchQuery().trim().toLowerCase();
    if (query !== '') {
      list = list.filter(
        (booking) =>
          booking.court.toLowerCase().includes(query) ||
          booking.user.toLowerCase().includes(query) ||
          booking.rut.toLowerCase().includes(query),
      );
    }
    this.filteredBookings.set(list);

    const startIndex = (this.currentPage() - 1) * this.pageSize();
    this.paginatedBookings.set(list.slice(startIndex, startIndex + this.pageSize()));
  }

  changePage(page: number): void {
    this.currentPage.set(page);
    this.updateFilteringAndPagination();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.updateFilteringAndPagination();
  }

  contactUser(booking: Booking): void {
    booking.isContacted = true;
    this.paginatedBookings.set([...this.paginatedBookings()]);
    if (booking.whatsAppLink) {
      window.open(booking.whatsAppLink, '_blank');
    } else {
      const phoneNumber = booking.rut.replace(/\+/g, '');
      const message = `Hola ${booking.user}, nos contactamos de Deportes UCN para recordarte tu reserva de ${booking.court} en el bloque ${booking.time}.`;
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  }

  updateBookingStatus(id: number, status: 'Confirmed' | 'Cancelled'): void {
    this.bookingsService.updateStatus(id, status).subscribe({
      next: () => {
        this.loadBookings();
      },
      error: (err) => {
        console.error('Error updating booking status', err);
      }
    });
  }

  addNewReservation(): void {
    console.log('Abriendo modal para nueva reserva...');
  }
}
