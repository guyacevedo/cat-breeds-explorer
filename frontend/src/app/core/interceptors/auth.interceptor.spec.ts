import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  function configure(token: string | null) {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { token: () => token } },
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
  }

  it('adds the Authorization header when a token exists', () => {
    // Arrange
    configure('abc.123');
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    // Act
    http.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');

    // Assert
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc.123');
    req.flush({});
  });

  it('does not add the header when there is no token', () => {
    // Arrange
    configure(null);
    const http = TestBed.inject(HttpClient);
    const httpMock = TestBed.inject(HttpTestingController);

    // Act
    http.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');

    // Assert
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
