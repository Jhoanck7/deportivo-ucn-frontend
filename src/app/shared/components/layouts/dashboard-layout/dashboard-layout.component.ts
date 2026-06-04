import { AuthService } from "../../../../core/services/auth.service";
import { Component,inject } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { AdminDashboardComponent } from "../../../../features/dashboard/admin/components/admin-dashboard.component";


@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [RouterLink, RouterOutlet, RouterLinkActive, AdminDashboardComponent],
    templateUrl: "./dashboard-layout.component.html",
    styleUrl: "./dashboard-layout.component.css",
})

export class DashboardLayoutComponent {

  private authService = inject(AuthService);

  currentUser = this.authService.currentUser;
  currentUserRole = this.authService.currentUserRole;
  currentUsername = this.authService.currentUsername;

  logout(): void {
    this.authService.logout();
  }

}