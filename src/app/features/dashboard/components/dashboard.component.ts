import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly apiUrl = 'http://localhost:5059/api/test';
  private http = inject(HttpClient);
  private router = inject(Router);
  backendMessage: string = '';

  ngOnInit(): void {
    this.http.get<any>(this.apiUrl)
      .subscribe({
        next: (response) => {
          this.backendMessage = response.mensaje;
          console.log('datos del backend:', response);
        },
        error: (error) => {
          console.error('Error conectando al backend', error);
          this.backendMessage = 'Error: No se pudo conectar al backend';
        }
      });
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
