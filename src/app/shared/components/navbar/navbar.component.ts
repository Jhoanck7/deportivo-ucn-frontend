import { Component, inject, computed } from "@angular/core";
import { NavItem } from "../../models/navigation.model";
import { AuthService } from "../../../core/services/auth.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})

export class NavbarComponent {
    private authService = inject(AuthService);

    private menuConfig: NavItem[] = [
    {label: 'Inicio', routerLink: '/home'},
        //todo: to do these routes
    {label: 'Reservar cancha',routerLink: '/rent'},
    {label: 'Nosotros', routerLink: '/about'},
    {label: 'Diseño del sistema', routerLink: '/design-system'}
    ]
    items = this.menuConfig;

    isAuthenticated = this.authService.isAuthenticated;
    currentUser = this.authService.currentUser;
    
    visibleMenuItems = computed(() => {
        const role = this.authService.currentUserRole();
        return this.menuConfig.filter(item => {
            if (!item.roles) {
                return true;
            }
            return role? item.roles.includes(role): false;
        });
    });
    changeRole(role: 'Admin' | 'User') {
        this.authService.setSession({
          token: 'fake-jwt-token',
          email: role === 'Admin' ? 'admin.deportivo@ucn.cl' : 'user@ucn.cl',
          firstName: role,
          lastName: 'Demo',
          role,
        });
    }

    logout() {
        this.authService.logout();
    }
}

