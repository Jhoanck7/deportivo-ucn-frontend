import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/api-response.model';

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  date: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

@Injectable({ providedIn: 'root' })
export class NewsEventsService {
  private readonly http = inject(HttpClient);
  
  // Endpoints configurados en NewsEventController
  private readonly newsBase = 'news';
  private readonly eventsBase = 'events';

  // 📰 Métodos de Noticias
  listNews(): Observable<ApiResponse<NewsItem[]>> {
    return this.http.get<ApiResponse<NewsItem[]>>(this.newsBase);
  }

  createNews(news: Omit<NewsItem, 'id' | 'date'>): Observable<ApiResponse<NewsItem>> {
    return this.http.post<ApiResponse<NewsItem>>(this.newsBase, news);
  }

  deleteNews(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.newsBase}/${id}`);
  }

  // 📅 Métodos de Eventos
  listEvents(): Observable<ApiResponse<EventItem[]>> {
    return this.http.get<ApiResponse<EventItem[]>>(this.eventsBase);
  }

  createEvent(event: Omit<EventItem, 'id'>): Observable<ApiResponse<EventItem>> {
    return this.http.post<ApiResponse<EventItem>>(this.eventsBase, event);
  }

  deleteEvent(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.eventsBase}/${id}`);
  }
}
