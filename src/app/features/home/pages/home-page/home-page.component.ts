import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterOutlet } from "@angular/router";
import { HomeFeature } from "./home-feature.model";
import { AuthService } from "../../../../core/services/auth.service";


@Component({
    selector: 'app-home-page',
    templateUrl : "./home-page.component.html",
    styleUrl: "./home-page.component.css",
    
    imports: [RouterOutlet, CommonModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {

    heroTitle = signal<string>('Centro deportivo UCN');
    heroSubtitle = signal<string>('Accede a nuestras instalaciones deportivas y gestiona tus reservas de manera eficiente.');
    
    //auth logic 
    private authService =  inject(AuthService);
    isAuthenticated = this.authService.isAuthenticated;
    currentUser = this.authService.currentUser;


    features = signal<HomeFeature[]>([
        {
            title: 'Gestión de Equipos',
            description: 'Administra jugadores, entrenadores y estadísticas de cada partido fácilmente.',
            icon: 'aqui pon la puta imagen'
        },
        {
            title: 'Reserva de Canchas',
            description: 'Automatiza el proceso de reservas para todas las instalaciones del complejo.',
            icon: 'aqui pon la puta imagen'
        },
        {
            title: 'Torneos y Ligas',
            description: 'Organiza competiciones, mantén tablas de posiciones y calendarios actualizados.',
            icon: 'aqui pon la puta imagen'
        }
    ]);
}
