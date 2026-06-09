import type { AxiosInstance } from 'axios';
import { catApiClient } from '../shared/cat-api.client.js';
import { AppError, ErrorCodes } from '../shared/app-error.js';
import type { Breed } from './breed.model.js';

/**
 * Business logic for cat breeds. Depends on an injected HTTP client
 * (Dependency Inversion) so it can be unit-tested with a mock.
 */
export class BreedService {
  constructor(private readonly client: AxiosInstance = catApiClient) {}

  async getAll(): Promise<Breed[]> {
    try {
      const { data } = await this.client.get<Breed[]>('/breeds');
      return data;
    } catch {
      throw new AppError('No se pudieron obtener las razas', ErrorCodes.UPSTREAM_ERROR, 502);
    }
  }

  async getById(breedId: string): Promise<Breed> {
    try {
      const { data } = await this.client.get<Breed>(`/breeds/${breedId}`);
      if (!data || !data.id) {
        throw new AppError(`Raza '${breedId}' no encontrada`, ErrorCodes.NOT_FOUND, 404);
      }
      return data;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(`Raza '${breedId}' no encontrada`, ErrorCodes.NOT_FOUND, 404);
    }
  }

  async search(query: string): Promise<Breed[]> {
    try {
      const { data } = await this.client.get<Breed[]>('/breeds/search', {
        params: { q: query },
      });
      return data;
    } catch {
      throw new AppError('Error en la búsqueda de razas', ErrorCodes.UPSTREAM_ERROR, 502);
    }
  }
}

export const breedService = new BreedService();
