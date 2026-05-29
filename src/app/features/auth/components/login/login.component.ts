import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Simular login exitoso y navegar al panel principal
    console.log('Login intent with:', this.email, 'password length:', this.password.length);
    this.router.navigate(['/dashboard']);
  }

  loginWithGoogle(): void {
    console.log('Login with Google triggered');
  }
}
