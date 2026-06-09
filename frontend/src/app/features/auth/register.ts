import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

/** Vista 4 — Register. Creates a user via the backend API. */
@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-md mx-auto w-full px-margin-mobile py-[80px]">
      <div class="bg-surface-container-lowest rounded-xl p-8 ambient-shadow-1">
        <h1 class="text-headline-md text-primary font-bold mb-2">Create your account</h1>
        <p class="text-body-md text-secondary mb-8">Join the Cat Breeds Encyclopedia.</p>

        <form (ngSubmit)="submit()" class="space-y-5">
          <div>
            <label class="text-label-caps uppercase tracking-wider text-secondary">Name</label>
            <input
              type="text"
              name="name"
              [(ngModel)]="name"
              required
              class="mt-1 w-full bg-[#F3F4F6] text-on-surface rounded-lg py-3 px-4 border-none focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#99462a] transition-all"
            />
          </div>
          <div>
            <label class="text-label-caps uppercase tracking-wider text-secondary">Email</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              class="mt-1 w-full bg-[#F3F4F6] text-on-surface rounded-lg py-3 px-4 border-none focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#99462a] transition-all"
            />
          </div>
          <div>
            <label class="text-label-caps uppercase tracking-wider text-secondary">Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              class="mt-1 w-full bg-[#F3F4F6] text-on-surface rounded-lg py-3 px-4 border-none focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#99462a] transition-all"
            />
          </div>

          @if (error()) {
            <p class="text-error text-body-md">{{ error() }}</p>
          }

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors ambient-shadow-1 disabled:opacity-60"
          >
            {{ loading() ? 'Creating…' : 'Create Account' }}
          </button>
        </form>

        <p class="text-body-md text-secondary mt-6 text-center">
          Already registered?
          <a routerLink="/login" class="text-primary font-semibold">Sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected name = '';
  protected email = '';
  protected password = '';
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  submit(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.error ?? 'No se pudo registrar el usuario');
          this.loading.set(false);
        },
      });
  }
}
