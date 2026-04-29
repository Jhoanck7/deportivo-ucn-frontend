import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('deportivo-ucn-frontend');
  private http = inject(HttpClient);
  backendMessage: string = '';
  //
  ngOnInit(): void {
    this.http.get<any>('http://localhost:5059/api/test')
      .subscribe({
        next: (response) => {
          this.backendMessage = response.mensaje;
          // This shows me how the data from the backend is coming in.
          console.log('datos del backend:', response);
        },
        error: (error) => {
          console.error('Error conectando al backend', error);
          this.backendMessage = 'Error: No se pudo conectar al backend'
        }
      })   
  }
}
