import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

/**
 * Vista 5 — User Profile, protected by authGuard. Shows the logged-in user's
 * information fetched from the protected /auth/me endpoint.
 */
@Component({
  selector: 'app-profile',
  template: `
    <div class="max-w-2xl mx-auto w-full px-margin-mobile py-[80px]">
      @if (user(); as u) {
        <div class="bg-surface-container-lowest rounded-xl p-8 ambient-shadow-1">
          <div class="flex items-center gap-6 mb-8">
            <div
              class="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center text-display-lg-mobile font-bold"
            >
              {{ u.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-headline-md text-primary font-bold">{{ u.name }}</h1>
              <p class="text-body-md text-secondary">{{ u.email }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="bg-surface-container-low rounded-lg p-5">
              <span class="text-label-caps uppercase tracking-wider text-secondary">User ID</span>
              <p class="text-body-md text-on-surface break-all">{{ u.id }}</p>
            </div>
            <div class="bg-surface-container-low rounded-lg p-5">
              <span class="text-label-caps uppercase tracking-wider text-secondary">Email</span>
              <p class="text-body-md text-on-surface">{{ u.email }}</p>
            </div>
          </div>

          <button
            (click)="logout()"
            class="mt-8 bg-primary text-on-primary py-3 px-8 rounded-lg font-semibold hover:bg-primary-container transition-colors ambient-shadow-1"
          >
            Logout
          </button>
        </div>
      } @else {
        <p class="text-secondary">Loading profile…</p>
      }
    </div>
  `,
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = signal<User | null>(this.auth.user());

  constructor() {
    // Refresh from the protected endpoint to validate the session server-side.
    this.auth.me().subscribe({
      next: (u) => this.user.set(u),
      error: () => this.logout(),
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
