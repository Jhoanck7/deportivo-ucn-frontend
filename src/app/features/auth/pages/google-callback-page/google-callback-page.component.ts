import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-callback-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; color: #5f6368;">
      <div style="border: 4px solid #f3f3f3; border-top: 4px solid #1a73e8; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 1rem;"></div>
      <p>Conectando con Deportes UCN...</p>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `
})
export class GoogleCallbackPageComponent implements OnInit {
  ngOnInit(): void {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');
      
      if (idToken && window.opener) {
        // Enviar el token de vuelta a la ventana principal
        window.opener.postMessage({
          type: 'google-real-success',
          idToken: idToken
        }, window.location.origin);
        
        // Cerrar el popup
        window.close();
      }
    } else {
      // Si se abre directo sin hash
      setTimeout(() => {
        if (window.opener) window.close();
      }, 3000);
    }
  }
}
