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
  selectedRole: 'admin' | 'user' = 'user';

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    console.log('Login intent with:', this.email, 'role:', this.selectedRole);
    // Auto-detect admin role if email contains 'admin'
    if (this.email.toLowerCase().includes('admin')) {
      this.selectedRole = 'admin';
    }
    
    if (this.selectedRole === 'admin') {
      this.router.navigate(['/dashboard/admin']);
    } else {
      this.router.navigate(['/dashboard/user']);
    }
  }

  loginWithGoogle(): void {
    console.log('Login with Google triggered');
  }
}
