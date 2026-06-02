import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
interface MockUserRecord {
  email: string;
  password:  string;
  username:  string;
  role: 'admin' | 'user';
}
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private router = inject(Router);
  private authService = inject(AuthService);


  email = '';
  password = '';
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string| null>(null);
  isAuthenticated = this.authService.isAuthenticated;
  selectedRole = signal<'admin' | 'user'>('user')


  private mockUserDatabase: MockUserRecord[] = [
      {
        email: 'admin.deportivo@ucn.cl',
        password:  'UcnAdmin2026',
        username:  'Director de Deportes UCN',
        role: 'admin'
      },
      {
        email: 'tesoreria.club@ucn.cl',
        password:  'Finanzas123',
        username:  'Encargado de Finanzas',
        role: 'admin'
      },
      {
        email: 'claudio.bravoucn@gmail.com',
        password:  'SocioSocio12',
        username:  'Claudio Bravo (Socio Activo)',
        role: 'user'
      },
      {
        email: 'profe.marcelo@ucn.cl',
        password:  'FutbolUcn2026',
        username:  'Prof. Marcelo Bielsa',
        role: 'user'
      }
    ];

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value)
  }

  onSubmit(): void {
    if(this.isAuthenticated()) {
      this.errorMessage.set('Ya tienes una sesión iniciada.|');
      this.router.navigate(['/']);
      return;
    }
    if (!this.email || !this.password) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const foundUser = this.mockUserDatabase.find(
      user => user.email.toLowerCase() === this.email.toLowerCase() && user.password === this.password
    );
    setTimeout(() => {
    
    if (!foundUser) {
     
      this.errorMessage.set('Credenciales inválidas. El correo o la contraseña no coinciden con nuestros registros del Club.');
      this.isLoading.set(false);
      return; 
      
    } else {
      const finalRole = foundUser.role;

      this.authService.loginAs(finalRole);
      
      this.authService['currentUserSignal'].update(session => session ? {
        ...session,
        username: foundUser.username
      } : null);

      this.isLoading.set(false);
      
      this.router.navigate(['/']);
    }

  }, 1200);  
   }
  loginWithGoogle(): void {
    console.log('Login with Google triggered');
  }
}
