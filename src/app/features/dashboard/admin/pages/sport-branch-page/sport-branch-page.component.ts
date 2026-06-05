import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportBranchesService, SportBranch } from '../../services/sport-branches.service';

@Component({
  selector: 'app-sport-branch-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sport-branch-page.component.html',
})
export class SportBranchPageComponent implements OnInit {
  private branchesService = inject(SportBranchesService);
  branches = signal<SportBranch[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading.set(true);
    this.branchesService.list().subscribe({
      next: (response) => {
        this.branches.set(response.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading branches', err);
        this.isLoading.set(false);
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
}
