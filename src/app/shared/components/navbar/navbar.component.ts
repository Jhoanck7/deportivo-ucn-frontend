import { Component, inject, computed } from "@angular/core";
import { NavItem } from "../../models/navigation.model";
import { AuthService } from "../../../core/services/auth.service";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
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
    changeRole(role: 'admin' | 'user') {
        this.authService.loginAs(role);
    }

    logout() {
        this.authService.logout();
    }
}

