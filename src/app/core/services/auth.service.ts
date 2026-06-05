import { Injectable, signal, computed } from "@angular/core";
import { AuthSession } from '../models/auth-session.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
    providedIn: 'root'

})

export class AuthService {
    private readonly session = signal<AuthSession | null>(null)

    readonly currentUser = this.session.asReadonly()

    readonly currentUserRole = computed(() => this.session()?.role ?? null)
    
    readonly isAuthenticated = computed(() => this.session() !== null)

    constructor(private tokenStorage: TokenStorageService) {
        const token = this.tokenStorage.getToken();
        const userStr = localStorage.getItem('deportivo_ucn_user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.session.set({
                    token,
                    ...user
                });
            } catch (e) {
                this.logout();
            }
        }
    }

    setSession(session: AuthSession): void {
        this.session.set(session);
        this.tokenStorage.setToken(session.token);
        localStorage.setItem(
            'deportivo_ucn_user',
            JSON.stringify({
                email: session.email,
                firstName: session.firstName,
                lastName: session.lastName,
                role: session.role,
            })
        );
    }

    logout(): void {
        this.session.set(null);
        this.tokenStorage.clear();
        localStorage.removeItem('deportivo_ucn_user');
    }

    
}