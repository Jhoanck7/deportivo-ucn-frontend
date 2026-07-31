import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../core/services/auth.service";
import { ApiResponse } from "../../../../core/models/api-response.model";
import { SportBranchesService, SportBranch } from "../../../dashboard/admin/services/sport-branches.service";
import { NewsEventsService, NewsItem } from "../../../dashboard/admin/services/news-events.service";

@Component({
    selector: 'app-home-page',
    templateUrl : "./home-page.component.html",
    styleUrl: "./home-page.component.css",
    imports: [CommonModule, RouterLink],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {

    heroTitle = signal<string>('Centro deportivo UCN');
    heroSubtitle = signal<string>('Accede a nuestras instalaciones deportivas y gestiona tus reservas de manera eficiente.');
    
    private authService = inject(AuthService);
    private branchesService = inject(SportBranchesService);
    private newsService = inject(NewsEventsService);

    isAuthenticated = this.authService.isAuthenticated;
    currentUser = this.authService.currentUser;
    branches = signal<SportBranch[]>([]);
    newsList = signal<NewsItem[]>([]);

    ngOnInit(): void {
        this.loadBranches();
        this.loadNews();
    }

    loadBranches(): void {
        this.branchesService.list().subscribe({
            next: (response: ApiResponse<SportBranch[]>) => {
                this.branches.set(response.data || []);
            },
            error: (err: unknown) => {
                console.error('Error loading branches in home', err);
            }
        });
    }

    loadNews(): void {
        this.newsService.listNews().subscribe({
            next: (response: ApiResponse<NewsItem[]>) => {
                this.newsList.set(response.data || []);
            },
            error: (err: unknown) => {
                console.error('Error loading news in home', err);
            }
        });
    }

    getImageUrl(name: string): string {
        if (name.toLowerCase().includes('tenis')) {
            return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80';
        }
        if (name.toLowerCase().includes('fútbol') || name.toLowerCase().includes('futbol')) {
            return 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80';
        }
        return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80';
    }

    formatDate(dateStr: string): string {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-CL', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    }

    scrollToBranches(): void {
        const el = document.querySelector('.features-section');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
