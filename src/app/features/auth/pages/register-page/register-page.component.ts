import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authApiService = inject(AuthApiService);

  firstName = '';
  lastName = '';
  rut = '';
  email = '';
  phone = '';
  password = '';
  
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (!this.firstName || !this.lastName || !this.rut || !this.email || !this.phone || !this.password) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authApiService.register({
      firstName: this.firstName,
      lastName: this.lastName,
      rut: this.rut,
      email: this.email,
      phone: this.phone,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.data) {
          this.authService.setSession({
            token: response.data.token,
            email: response.data.email,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            role: response.data.role,
          });
          this.router.navigate(['/']);
        } else {
          this.errorMessage.set('Error en la respuesta del servidor.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Error al registrar la cuenta. Asegúrese de que el RUT o correo no estén en uso.'
        );
      }
    });
  }
}
