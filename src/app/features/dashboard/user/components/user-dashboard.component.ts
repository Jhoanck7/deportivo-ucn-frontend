import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface MiReserva {
  id: string;
  hora: string;
  fecha: string;
  cancha: string;
  subtituloCancha: string;
  estado: 'ABONADO' | 'PENDIENTE';
  colorBorder: string;
}

interface CanchaDisponible {
  id: string;
  nombre: string;
  tipo: 'Tenis' | 'Pádel' | 'Multicancha';
  imagen: string;
  precio: string;
  estado: 'Disponible' | 'Poco Foco' | 'Ocupada';
  disponibilidad: string;
}

interface MiActividad {
  tipo: 'victoria' | 'amistoso' | 'entrenamiento';
  cancha: string;
  texto: string;
  tiempo: string;
}

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5059/api/test';
  private http = inject(HttpClient);
  private router = inject(Router);

  backendMessage: string = '';
  isBackendConnected: boolean = false;

  // Active state for navigation
  activeMenu: string = 'panel-principal';
  activeTimeTab: string = 'Hoy';

  // Logged user details (mock)
  userName: string = 'Gabriel Briones';
  userRut: string = '19.876.543-2';
  memberType: string = 'Socio Premium UCN';
  memberPoints: number = 350;

  // User's own reservations
  misReservas: MiReserva[] = [
    {
      id: 'RES-882',
      hora: '18:00',
      fecha: 'Mañana, 01 de Junio',
      cancha: 'Cancha Tenis #1',
      subtituloCancha: 'Superficie Rápida',
      estado: 'ABONADO',
      colorBorder: '#ff7c60'
    },
    {
      id: 'RES-901',
      hora: '19:30',
      fecha: 'Martes, 03 de Junio',
      cancha: 'Pádel Premium #2',
      subtituloCancha: 'Panorámica',
      estado: 'PENDIENTE',
      colorBorder: '#3b82f6'
    }
  ];

  // Available courts to book
  canchasDisponibles: CanchaDisponible[] = [
    {
      id: 'C-T1',
      nombre: 'Cancha Tenis #1',
      tipo: 'Tenis',
      imagen: '🎾',
      precio: '$8.000 / hora',
      estado: 'Disponible',
      disponibilidad: 'Hoy: 15:00, 16:30, 18:00'
    },
    {
      id: 'C-P2',
      nombre: 'Pádel Premium #2',
      tipo: 'Pádel',
      imagen: '🥎',
      precio: '$12.000 / hora',
      estado: 'Poco Foco',
      disponibilidad: 'Hoy: 19:30, 21:00'
    },
    {
      id: 'C-M1',
      nombre: 'Multicancha Central',
      tipo: 'Multicancha',
      imagen: '⚽',
      precio: '$10.000 / hora',
      estado: 'Disponible',
      disponibilidad: 'Hoy: Todo el día'
    },
    {
      id: 'C-T4',
      nombre: 'Cancha Tenis #4 (Arcilla)',
      tipo: 'Tenis',
      imagen: '🎾',
      precio: '$9.000 / hora',
      estado: 'Ocupada',
      disponibilidad: 'Próxima: Mañana 09:00'
    }
  ];

  // Member activity history
  misActividades: MiActividad[] = [
    {
      tipo: 'victoria',
      cancha: 'Cancha Tenis #1',
      texto: '¡Ganaste el partido contra Juan Muñoz! (6-4, 6-3)',
      tiempo: 'Hace 2 días'
    },
    {
      tipo: 'entrenamiento',
      cancha: 'Pádel Premium #1',
      texto: 'Entrenamiento individual - Práctica de servicio',
      tiempo: 'Hace 5 días'
    },
    {
      tipo: 'amistoso',
      cancha: 'Multicancha Central',
      texto: 'Partido amistoso de Fútbol 5 con amigos',
      tiempo: 'Hace 1 semana'
    }
  ];

  ngOnInit(): void {
    this.checkBackendConnection();
  }

  checkBackendConnection(): void {
    this.http.get<any>(this.apiUrl)
      .subscribe({
        next: (response) => {
          this.backendMessage = response.mensaje;
          this.isBackendConnected = true;
        },
        error: (error) => {
          console.error('Error conectando al backend', error);
          this.backendMessage = 'Error: No se pudo conectar al backend';
          this.isBackendConnected = false;
        }
      });
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  onTimeTabChange(tab: string): void {
    this.activeTimeTab = tab;
  }

  onSupportClick(): void {
    window.open('https://wa.me/56912345678?text=Hola,%20necesito%20soporte%20como%20socio%20de%20Deportes%20UCN.', '_blank');
  }

  bookCourt(cancha: CanchaDisponible): void {
    alert(`Iniciando reserva para la cancha: ${cancha.nombre}.\nPrecio: ${cancha.precio}\n¡Cargando pasarela de pago y confirmación!`);
  }

  cancelReservation(reserva: MiReserva): void {
    if (confirm(`¿Estás seguro que deseas cancelar tu reserva para la ${reserva.cancha} a las ${reserva.hora}?`)) {
      this.misReservas = this.misReservas.filter(r => r.id !== reserva.id);
      alert('Reserva cancelada con éxito. El reembolso se procesará según las políticas del club.');
    }
  }

  downloadVoucher(reserva: MiReserva): void {
    alert(`Descargando comprobante de reserva ${reserva.id} para ${reserva.cancha} en formato PDF...`);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
