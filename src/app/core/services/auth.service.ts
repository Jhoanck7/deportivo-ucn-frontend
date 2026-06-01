import { Injectable, signal, computed } from "@angular/core";

export interface UserSession {
    username: string;
    role: 'admin'| 'user';
    token: string;
}

@Injectable({
    providedIn: 'root'

})

export class AuthService {
    private currentUserSignal = signal<UserSession | null>(null)

    currentUser = this.currentUserSignal.asReadonly()

    currentUserRole = computed(() => this.currentUserSignal()?.role ?? null)
    
    isAuthenticated = computed(() => this.currentUserSignal() !== null)

    loginAs(role: 'admin' | 'user') {
        this.currentUserSignal.set({
            username: `Test ${role}`,
            role: role,
            token: 'fake-jwt-token'
        });
    }

    logout() {
        this.currentUserSignal.set(null);
    }
}