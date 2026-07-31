import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  private authService = inject(AuthService);
  currentYear = new Date().getFullYear();

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
}
