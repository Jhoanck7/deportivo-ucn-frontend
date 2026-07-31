import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsEventsService, NewsItem, EventItem } from '../../services/news-events.service';
import { ImageUploadService } from '../../services/image-upload.service';

@Component({
  selector: 'app-news-events-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './news-events-page.component.html',
  styleUrl: './news-events-page.component.css'
})
export class NewsEventsPageComponent implements OnInit {
  private service = inject(NewsEventsService);
  private fb = inject(NonNullableFormBuilder);
  private uploadService = inject(ImageUploadService);

  // Estados reactivos
  newsList = signal<NewsItem[]>([]);
  eventsList = signal<EventItem[]>([]);
  activeTab = signal<'news' | 'events'>('news');
  isModalOpen = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  isUploadingImage = signal<boolean>(false);

  // Formulario para Noticias
  newsForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    category: ['CONVOCATORIA', [Validators.required]],
    imageUrl: ['', [Validators.required]]
  });

  // Formulario para Eventos
  eventForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', [Validators.required]],
    location: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading.set(true);
    this.loadNews();
    this.loadEvents();
  }

  loadNews(): void {
    this.service.listNews().subscribe({
      next: (res) => {
        this.newsList.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading news:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadEvents(): void {
    this.service.listEvents().subscribe({
      next: (res) => {
        this.eventsList.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'news' | 'events'): void {
    this.activeTab.set(tab);
  }

  openCreateModal(): void {
    this.newsForm.reset({ category: 'CONVOCATORIA' });
    this.eventForm.reset();
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onSubmit(): void {
    if (this.activeTab() === 'news') {
      if (this.newsForm.invalid) return;
      this.isSaving.set(true);
      const payload = this.newsForm.getRawValue();
      this.service.createNews(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadNews();
        },
        error: (err) => {
          console.error('Error creating news:', err);
          this.isSaving.set(false);
        }
      });
    } else {
      if (this.eventForm.invalid) return;
      this.isSaving.set(true);
      const payload = this.eventForm.getRawValue();
      this.service.createEvent(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.closeModal();
          this.loadEvents();
        },
        error: (err) => {
          console.error('Error creating event:', err);
          this.isSaving.set(false);
        }
      });
    }
  }

  onDeleteNews(id: number, title: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la noticia "${title}"?`)) {
      this.service.deleteNews(id).subscribe({
        next: () => this.loadNews(),
        error: (err) => console.error('Error deleting news:', err)
      });
    }
  }

  onDeleteEvent(id: number, title: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el evento "${title}"?`)) {
      this.service.deleteEvent(id).subscribe({
        next: () => this.loadEvents(),
        error: (err) => console.error('Error deleting event:', err)
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingImage.set(true);
      
      this.uploadService.upload(file).subscribe({
        next: (response) => {
          this.isUploadingImage.set(false);
          if (response.data?.url) {
            this.newsForm.patchValue({ imageUrl: response.data.url });
          }
        },
        error: (err) => {
          console.error('Error uploading file:', err);
          this.isUploadingImage.set(false);
          alert('Error al subir la imagen al servidor');
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  }
}
