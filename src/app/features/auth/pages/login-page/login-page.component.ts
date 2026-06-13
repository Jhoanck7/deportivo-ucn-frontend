import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authApiService = inject(AuthApiService);

  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  isAuthenticated = this.authService.isAuthenticated;

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSubmit(): void {
    if (this.isAuthenticated()) {
      this.errorMessage.set('Ya tienes una sesión iniciada.');
      this.router.navigate(['/']);
      return;
    }
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authApiService.login({ emailOrRut: this.email, password: this.password }).subscribe({
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
          this.router.navigate(response.data.role === 'Admin' ? ['/dashboard-admin'] : ['/']);
        } else {
          this.errorMessage.set('Error en la respuesta del servidor.');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          err.error?.message || 'Credenciales inválidas. El correo o la contraseña no coinciden.'
        );
      }
    });
  }

  loginWithGoogle(): void {
    console.log('Login with Google triggered');
  }
}
