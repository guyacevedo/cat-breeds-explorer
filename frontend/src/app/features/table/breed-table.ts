import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BreedService } from '../../core/services/breed.service';
import { Breed, BreedRow, toBreedRow } from '../../core/models/breed.model';

/**
 * Vista adicional + Vista 2 — Breed Data Table with a text search filter.
 * Typing text and clicking "Search" filters the table by matching breeds.
 */
@Component({
  selector: 'app-breed-table',
  imports: [FormsModule],
  template: `
    <div class="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-[80px]">
      <div class="mb-10">
        <h1 class="text-display-lg-mobile md:text-display-lg text-primary mb-4">Breed Data Table</h1>
        <p class="text-body-lg text-secondary">
          Browse and search the most relevant data across all cat breeds.
        </p>
      </div>

      <!-- Search filter -->
      <form (ngSubmit)="applySearch()" class="flex gap-4 mb-8 max-w-xl">
        <input
          type="text"
          name="search"
          [(ngModel)]="searchText"
          placeholder="Search by name, origin or temperament..."
          class="flex-1 bg-[#F3F4F6] text-on-surface rounded-full py-3 px-6 border-none focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_#99462a] transition-all ambient-shadow-1"
        />
        <button
          type="submit"
          class="bg-primary text-on-primary py-3 px-8 rounded-full font-semibold hover:bg-primary-container transition-colors ambient-shadow-1"
        >
          Search
        </button>
      </form>

      @if (loading()) {
        <p class="text-secondary">Loading…</p>
      } @else if (error()) {
        <p class="text-error">{{ error() }}</p>
      } @else {
        <div class="bg-surface-container-lowest rounded-xl ambient-shadow-1 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-outline-variant/30 text-label-caps uppercase tracking-wider text-secondary">
                  <th class="px-6 py-4">Name</th>
                  <th class="px-6 py-4">Origin</th>
                  <th class="px-6 py-4">Life Span</th>
                  <th class="px-6 py-4">Weight</th>
                  <th class="px-6 py-4">Temperament</th>
                </tr>
              </thead>
              <tbody>
                @for (row of filteredRows(); track row.id) {
                  <tr class="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td class="px-6 py-4 font-semibold text-on-surface">{{ row.name }}</td>
                    <td class="px-6 py-4 text-secondary">{{ row.origin }}</td>
                    <td class="px-6 py-4 text-secondary">{{ row.life_span }}</td>
                    <td class="px-6 py-4 text-secondary">{{ row.weight }}</td>
                    <td class="px-6 py-4 text-secondary line-clamp-1 max-w-xs">{{ row.temperament }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-10 text-center text-secondary">
                      No breeds match your search.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class BreedTable {
  private readonly breedService = inject(BreedService);

  protected searchText = '';
  protected readonly query = signal('');
  protected readonly rows = signal<BreedRow[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly filteredRows = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.rows();
    return this.rows().filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.temperament.toLowerCase().includes(q),
    );
  });

  constructor() {
    this.breedService.getAll().subscribe({
      next: (breeds: Breed[]) => {
        this.rows.set(breeds.map(toBreedRow));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las razas');
        this.loading.set(false);
      },
    });
  }

  applySearch(): void {
    this.query.set(this.searchText);
  }
}
