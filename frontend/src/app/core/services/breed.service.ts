import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { Breed } from '../models/breed.model';

/**
 * Service layer for cat breeds. Uses functional DI (inject()) — no constructor DI.
 */
@Injectable({ providedIn: 'root' })
export class BreedService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getAll(): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.baseUrl}/breeds`);
  }

  getById(breedId: string): Observable<Breed> {
    return this.http.get<Breed>(`${this.baseUrl}/breeds/${breedId}`);
  }

  search(query: string): Observable<Breed[]> {
    return this.http.get<Breed[]>(`${this.baseUrl}/breeds/search`, {
      params: { q: query },
    });
  }
}
