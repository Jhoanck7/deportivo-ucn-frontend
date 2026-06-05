import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AthletesService } from '../../../../athletes/services/athletes.service';
import { Athlete } from '../../../../../shared/models/athlete.model';

@Component({
  selector: 'app-roster-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roster-page.component.html',
})
export class RosterPageComponent implements OnInit {
  private athletesService = inject(AthletesService);

  athletes = signal<Athlete[]>([]);
  filteredAthletes = signal<Athlete[]>([]);
  isLoading = signal<boolean>(false);
  searchQuery = signal<string>('');

  ngOnInit(): void {
    this.loadAthletes();
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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.applyFilter();
  }

  applyFilter(): void {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      this.filteredAthletes.set(this.athletes());
      return;
    }
    const filtered = this.athletes().filter(
      (a) =>
        a.firstName.toLowerCase().includes(query) ||
        a.lastName.toLowerCase().includes(query) ||
        a.rut.toLowerCase().includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.sportBranchName.toLowerCase().includes(query)
    );
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