import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SportBranchesService, SportBranch } from '../../services/sport-branches.service';
import{ BranchFormComponent }from '../../components/make-branch/make-branch-form.component';


@Component({
  selector: 'app-sport-branch-page',
  standalone: true,
  imports: [CommonModule, BranchFormComponent ],
  templateUrl: './sport-branch-page.component.html',
  styleUrl: './sport-branch-page.component.css'
})
export class SportBranchPageComponent implements OnInit {
  private branchesService = inject(SportBranchesService);
  branches = signal<SportBranch[]>([]);
  isLoading = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  selectedBranch = signal<SportBranch | undefined>(undefined); // Para edición


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

  openCreateModal(): void {
    this.selectedBranch.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(branch: SportBranch): void {
    this.selectedBranch.set(branch);
    this.isModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.isModalOpen.set(false);
    this.selectedBranch.set(undefined);
  }

  saveNewBranch(branchData: any): void {
    this.isSaving.set(true);
    const editingBranch = this.selectedBranch();

    if (editingBranch) {
      // Modo Edición
      this.branchesService.update(editingBranch.id, branchData).subscribe({
        next: (response) => {
          this.isSaving.set(false);
          this.closeCreateModal();
          this.loadBranches();
        },
        error: (err) => {
          console.error('Error updating sports branch:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      // Modo Creación
      this.branchesService.create(branchData).subscribe({
        next: (response) => {
          this.isSaving.set(false);
          this.closeCreateModal();
          this.loadBranches();
        },
        error: (err) => {
          console.error('Error creating sports branch:', err);
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteBranch(id: number): void {
    this.isSaving.set(true);
    this.branchesService.delete(id).subscribe({
      next: (response) => {
        this.isSaving.set(false);
        this.closeCreateModal();
        this.loadBranches();
      },
      error: (err) => {
        console.error('Error deleting sports branch:', err);
        this.isSaving.set(false);
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
