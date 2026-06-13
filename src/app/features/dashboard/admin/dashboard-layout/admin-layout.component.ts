import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
})
export class AdminLayoutComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  onSupportClick(): void {
    window.open('https://wa.me/56912345678?text=Hola,%20necesito%20soporte%20con%20el%20sistema%20de%20Deportes%20UCN.', '_blank');
  }

  addNewReservation(): void {
    console.log('Navegar a nueva reserva o abrir modal global');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
