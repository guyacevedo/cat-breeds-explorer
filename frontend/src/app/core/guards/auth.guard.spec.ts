import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  function setup(isAuthenticated: boolean) {
    const auth = { isAuthenticated: () => isAuthenticated } as AuthService;
    const urlTree = {} as UrlTree;
    const router = { createUrlTree: () => urlTree } as unknown as Router;
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
    return { urlTree };
  }

  it('allows activation when authenticated', () => {
    // Arrange
    setup(true);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any),
    );

    // Assert
    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    // Arrange
    const { urlTree } = setup(false);

    // Act
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any),
    );

    // Assert
    expect(result).toBe(urlTree);
  });
});
