import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthApiService } from '../../services/auth-api.service';
import { environment } from '../../../../../environments/environment';

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
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const width = 500;
    const height = 600;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    const isRealGoogleConfigured = environment.googleClientId && environment.googleClientId !== 'YOUR_GOOGLE_CLIENT_ID';
    
    let url = '/auth/google-sim';
    if (isRealGoogleConfigured) {
      const redirectUri = encodeURIComponent(`${window.location.origin}/auth/google-callback`);
      url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${environment.googleClientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=openid%20email%20profile&nonce=google_auth_nonce_${Date.now()}&state=auth_state`;
    } else {
      console.warn('Deportes UCN: Usando simulador de Google. Configura googleClientId en environment.ts para usar cuentas reales.');
    }

    // Abrir ventana popup
    const popup = window.open(
      url,
      'Google Sign-In',
      `width=${width},height=${height},top=${top},left=${left},status=no,menubar=no,toolbar=no`
    );

    // Escuchar el mensaje enviado por el popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      // 1. Manejo del flujo simulado
      if (event.data?.type === 'google-auth-success') {
        const userData = event.data.user;
        this.authService.setSession({
          token: 'google-oauth-mock-jwt-token',
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        });
        this.isLoading.set(false);
        window.removeEventListener('message', messageListener);
        this.router.navigate(userData.role === 'Admin' ? ['/dashboard-admin'] : ['/']);
      }
      
      // 2. Manejo del flujo real con Google ID Token
      if (event.data?.type === 'google-real-success') {
        const idToken = event.data.idToken;
        this.authApiService.googleLogin(idToken).subscribe({
          next: (res) => {
            this.isLoading.set(false);
            window.removeEventListener('message', messageListener);
            if (res.data) {
              this.authService.setSession({
                token: res.data.token,
                email: res.data.email,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                role: res.data.role
              });
              this.router.navigate(res.data.role === 'Admin' ? ['/dashboard-admin'] : ['/']);
            }
          },
          error: (err) => {
            this.isLoading.set(false);
            window.removeEventListener('message', messageListener);
            this.errorMessage.set(err.error?.message || 'Error al validar la cuenta de Google en el servidor.');
          }
        });
      }
    };

    window.addEventListener('message', messageListener);

    // Detección por si cierran la ventana sin elegir cuenta
    const timer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(timer);
        this.isLoading.set(false);
        window.removeEventListener('message', messageListener);
      }
    }, 1000);
  }
}
