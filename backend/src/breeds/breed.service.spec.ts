import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import { BreedService } from './breed.service.js';
import { AppError } from '../shared/app-error.js';

function mockClient(impl: Partial<AxiosInstance>): AxiosInstance {
  return impl as AxiosInstance;
}

describe('BreedService', () => {
  it('getAll returns breeds from the API', async () => {
    // Arrange
    const breeds = [{ id: 'abys', name: 'Abyssinian' }];
    const get = vi.fn().mockResolvedValue({ data: breeds });
    const service = new BreedService(mockClient({ get }));

    // Act
    const result = await service.getAll();

    // Assert
    expect(get).toHaveBeenCalledWith('/breeds');
    expect(result).toEqual(breeds);
  });

  it('getAll throws an AppError on upstream failure', async () => {
    // Arrange
    const get = vi.fn().mockRejectedValue(new Error('network'));
    const service = new BreedService(mockClient({ get }));

    // Act & Assert
    await expect(service.getAll()).rejects.toBeInstanceOf(AppError);
  });

  it('getById returns the requested breed', async () => {
    // Arrange
    const breed = { id: 'beng', name: 'Bengal' };
    const get = vi.fn().mockResolvedValue({ data: breed });
    const service = new BreedService(mockClient({ get }));

    // Act
    const result = await service.getById('beng');

    // Assert
    expect(get).toHaveBeenCalledWith('/breeds/beng');
    expect(result).toEqual(breed);
  });

  it('search forwards the query parameter', async () => {
    // Arrange
    const get = vi.fn().mockResolvedValue({ data: [] });
    const service = new BreedService(mockClient({ get }));

    // Act
    await service.search('siam');

    // Assert
    expect(get).toHaveBeenCalledWith('/breeds/search', { params: { q: 'siam' } });
  });
});
