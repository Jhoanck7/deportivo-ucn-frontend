import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AthletesService } from '../../../../athletes/services/athletes.service';
import { Athlete } from '../../../../../shared/models/athlete.model';
import { SportBranchesService, SportBranch } from '../../services/sport-branches.service';

@Component({
  selector: 'app-roster-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roster-page.component.html',
})
export class RosterPageComponent implements OnInit {
  private athletesService = inject(AthletesService);
  private branchesService = inject(SportBranchesService);

  athletes = signal<Athlete[]>([]);
  branches = signal<SportBranch[]>([]);
  filteredAthletes = signal<Athlete[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = signal<string>('');
  selectedBranchId = signal<string>(''); // ID de la rama para filtrar

  ngOnInit(): void {
    this.loadAthletes();
    this.loadBranches();
  }

  loadAthletes(): void {
    this.isLoading.set(true);
    this.athletesService.list().subscribe({
      next: (response) => {
        const list = response.data || [];
        this.athletes.set(list);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading athletes', err);
        this.isLoading.set(false);
      }
    });
  }

  loadBranches(): void {
    this.branchesService.list().subscribe({
      next: (response) => {
        this.branches.set(response.data || []);
      },
      error: (err) => {
        console.error('Error loading branches', err);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.applyFilter();
  }

  onBranchFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedBranchId.set(value);
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery().trim().toLowerCase();
    const branchIdStr = this.selectedBranchId();

    let filtered = this.athletes();

    // 1. Filtrar por búsqueda textual
    if (query) {
      filtered = filtered.filter(
        (a) =>
          a.firstName.toLowerCase().includes(query) ||
          a.lastName.toLowerCase().includes(query) ||
          a.rut.toLowerCase().includes(query) ||
          a.email.toLowerCase().includes(query) ||
          a.sportBranchName.toLowerCase().includes(query)
      );
    }

    // 2. Filtrar por rama deportiva seleccionada
    if (branchIdStr) {
      const branchId = parseInt(branchIdStr, 10);
      filtered = filtered.filter((a) => a.sportBranchId === branchId);
    }

    this.filteredAthletes.set(filtered);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'
      });
    } catch {
      return dateStr;
    }
  }
}