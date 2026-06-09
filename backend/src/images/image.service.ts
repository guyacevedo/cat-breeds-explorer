import type { AxiosInstance } from 'axios';
import { catApiClient } from '../shared/cat-api.client.js';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import type { CatImage } from './image.model.js';

/** Business logic for cat images. HTTP client injected for testability. */
export class ImageService {
  constructor(private readonly client: AxiosInstance = catApiClient) {}

  async getByBreedId(breedId: string, limit = 8): Promise<CatImage[]> {
    try {
      const { data } = await this.client.get<CatImage[]>('/images/search', {
        params: { breed_ids: breedId, limit },
      });
      return data;
    } catch {
      throw new AppError(
        'No se pudieron obtener las imágenes de la raza',
        ErrorCodes.UPSTREAM_ERROR,
        502,
      );
    }
  }
}

export const imageService = new ImageService();
