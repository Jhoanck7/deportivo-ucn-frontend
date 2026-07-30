import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-sim-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-sim-page.component.html',
  styleUrl: './google-sim-page.component.css'
})
export class GoogleSimPageComponent {
  selectAccount(role: 'Admin' | 'User'): void {
    const mockUser = role === 'Admin' ? {
      email: 'admin@deportivoucn.cl',
      firstName: 'Administrador',
      lastName: 'General',
      role: 'Admin'
    } : {
      email: 'usuario@correo.com',
      firstName: 'Jhoan',
      lastName: 'Castro',
      role: 'User'
    };

    // Enviar el mensaje con los datos del usuario simulado a la ventana principal
    if (window.opener) {
      window.opener.postMessage({
        type: 'google-auth-success',
        user: mockUser
      }, window.location.origin);
      
      // Cerrar el popup de Google
      window.close();
    }
  }
}
