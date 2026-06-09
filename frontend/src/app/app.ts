import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

/**
 * Application shell: top navigation bar + routed content + footer.
 * Faithfully reproduces the Stitch "Feline Ethos" layout.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen flex flex-col">
      <header
        class="bg-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-300"
      >
        <div
          class="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20"
        >
          <a
            routerLink="/explorer"
            class="text-headline-md font-bold text-primary tracking-tight"
            >Cat Breeds</a
          >
          <nav class="hidden md:flex space-x-8 items-center">
            <a
              routerLink="/explorer"
              routerLinkActive="text-primary font-bold border-b-2 border-primary"
              class="text-secondary hover:text-primary transition-colors pb-1"
              >Explorer</a
            >
            <a
              routerLink="/table"
              routerLinkActive="text-primary font-bold border-b-2 border-primary"
              class="text-secondary hover:text-primary transition-colors pb-1"
              >Breed Table</a
            >
            @if (auth.isAuthenticated()) {
              <a
                routerLink="/profile"
                routerLinkActive="text-primary font-bold border-b-2 border-primary"
                class="text-secondary hover:text-primary transition-colors pb-1"
                >Profile</a
              >
            }
          </nav>
          @if (auth.isAuthenticated()) {
            <button
              (click)="logout()"
              class="text-primary hover:bg-secondary-container/30 rounded-lg px-4 py-2 transition-all active:scale-95"
            >
              Logout
            </button>
          } @else {
            <a
              routerLink="/login"
              class="text-primary hover:bg-secondary-container/30 rounded-lg px-4 py-2 transition-all active:scale-95"
            >
              Login
            </a>
          }
        </div>
      </header>

      <main class="flex-grow w-full">
        <router-outlet />
      </main>

      <footer class="bg-surface-container-lowest border-t border-outline-variant/20 mt-auto">
        <div
          class="flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto px-margin-desktop py-12 gap-gutter"
        >
          <div class="text-headline-md font-bold text-primary">Cat Breeds</div>
          <div class="text-body-md text-secondary text-center md:text-right">
            © 2024 Cat Breeds Encyclopedia. Dedicated to feline excellence.
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class App {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
