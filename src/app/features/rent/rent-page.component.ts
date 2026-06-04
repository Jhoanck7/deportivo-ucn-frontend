import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CourtRecord {
  id: number;
  name: string;
  type: string;
  price: string;
  icon: string;
  slots: TimeSlot[];
}

@Component({
  selector: 'app-rent-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rent-page.component.html',
  styleUrl: './rent-page.component.css'
})
export class RentPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;


  activeFilter = signal<'all' | 'futbol' | 'tenis'>('all');

  showAuthWarning = signal<boolean>(false);

  // mock, 
  courts = signal<CourtRecord[]>([
    {
      id: 1,
      name: 'Cancha Central de Fútbol',
      type: 'Pasto Sintético • Fútbol 7',
      price: '$25.000',
      icon: '⚽',
      slots: [
        { time: '16:00', available: true },
        { time: '17:30', available: false },
        { time: '19:00', available: true },
        { time: '20:30', available: true }
      ]
    },
    {
      id: 2,
      name: 'Tenis Court 1 — UCN',
      type: 'Cristal Panorámico • Dobles',
      price: '$18.000',
      icon: '🎾',
      slots: [
        { time: '16:30', available: false },
        { time: '18:00', available: true },
        { time: '19:30', available: false },
        { time: '21:00', available: true }
      ]
    }
  ]);


  setFilter(sport: 'all' | 'futbol' | 'tenis'): void {
    this.activeFilter.set(sport);
  }

 
  selectSlot(courtName: string, slotTime: string): void {
    if (!this.isAuthenticated()) {
      this.showAuthWarning.set(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2500);
      return;
    }

    console.log(`Abriendo pasarela de reserva: ${courtName} para las ${slotTime} hrs.`);
  }
}