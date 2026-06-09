import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import { ImageService } from './image.service.js';
import { AppError } from '../shared/app-error.js';

describe('ImageService', () => {
  it('getByBreedId queries /images/search with the breed id and limit', async () => {
    // Arrange
    const images = [{ id: '1', url: 'http://x/y.jpg' }];
    const get = vi.fn().mockResolvedValue({ data: images });
    const service = new ImageService({ get } as unknown as AxiosInstance);

    // Act
    const result = await service.getByBreedId('abys', 5);

    // Assert
    expect(get).toHaveBeenCalledWith('/images/search', {
      params: { breed_ids: 'abys', limit: 5 },
    });
    expect(result).toEqual(images);
  });

  it('throws an AppError when the upstream call fails', async () => {
    // Arrange
    const get = vi.fn().mockRejectedValue(new Error('boom'));
    const service = new ImageService({ get } as unknown as AxiosInstance);

    // Act & Assert
    await expect(service.getByBreedId('abys')).rejects.toBeInstanceOf(AppError);
  });
});
