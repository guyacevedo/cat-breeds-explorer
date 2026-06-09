import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { CatImage } from '../models/cat-image.model';

/** Service layer for cat images. */
@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getByBreedId(breedId: string): Observable<CatImage[]> {
    return this.http.get<CatImage[]>(`${this.baseUrl}/images/imagesbybreedid`, {
      params: { breed_id: breedId },
    });
  }
}
