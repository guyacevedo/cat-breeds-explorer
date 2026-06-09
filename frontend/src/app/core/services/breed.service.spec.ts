import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BreedService } from './breed.service';
import { Breed } from '../models/breed.model';

describe('BreedService', () => {
  let service: BreedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Arrange (shared)
    TestBed.configureTestingModule({
      providers: [BreedService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BreedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll requests /api/breeds and returns the breeds', () => {
    // Arrange
    const breeds = [{ id: 'abys', name: 'Abyssinian' }] as Breed[];
    let result: Breed[] | undefined;

    // Act
    service.getAll().subscribe((r) => (result = r));
    const req = httpMock.expectOne('/api/breeds');
    req.flush(breeds);

    // Assert
    expect(req.request.method).toBe('GET');
    expect(result).toEqual(breeds);
  });

  it('search sends the q query parameter', () => {
    // Arrange & Act
    service.search('siam').subscribe();
    const req = httpMock.expectOne((r) => r.url === '/api/breeds/search');

    // Assert
    expect(req.request.params.get('q')).toBe('siam');
    req.flush([]);
  });

  it('getById targets the breed-specific endpoint', () => {
    // Arrange & Act
    service.getById('beng').subscribe();
    const req = httpMock.expectOne('/api/breeds/beng');

    // Assert
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'beng' } as Breed);
  });
});
