import { Component, computed, inject, signal } from '@angular/core';
import { BreedService } from '../../core/services/breed.service';
import { ImageService } from '../../core/services/image.service';
import { Breed } from '../../core/models/breed.model';
import { CatImage } from '../../core/models/cat-image.model';

/**
 * Vista 1 — Breed Explorer: dropdown to select a breed, image carousel and
 * the relevant information of the selected breed. Reproduces the Stitch layout.
 */
@Component({
  selector: 'app-breed-explorer',
  template: `
    <div class="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-[80px]">
      <div class="mb-12 text-center max-w-2xl mx-auto">
        <h1 class="text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Discover Feline Excellence
        </h1>
        <p class="text-body-lg text-secondary">
          Explore the intricate details, rich histories, and unique temperaments of the world's
          most beloved cat breeds.
        </p>
      </div>

      <!-- Breed Selector -->
      <div class="flex justify-center mb-[80px]">
        <div class="w-full max-w-md relative">
          <select
            class="w-full bg-[#F3F4F6] text-on-surface text-body-lg rounded-full py-4 pl-6 pr-12 border-none focus:bg-surface-container-lowest focus:outline-none transition-all cursor-pointer ambient-shadow-1 focus:shadow-[0_0_0_2px_#99462a]"
            [value]="selectedId()"
            (change)="onSelect($any($event.target).value)"
          >
            <option value="" disabled>Select a Breed...</option>
            @for (breed of breeds(); track breed.id) {
              <option [value]="breed.id">{{ breed.name }}</option>
            }
          </select>
          <span
            class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary"
            >expand_more</span
          >
        </div>
      </div>

      @if (loading()) {
        <p class="text-center text-secondary">Loading…</p>
      }
      @if (error()) {
        <p class="text-center text-error">{{ error() }}</p>
      }

      @if (selectedBreed(); as breed) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Carousel -->
          <div class="lg:col-span-7 flex flex-col gap-unit">
            <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden ambient-shadow-1 group bg-surface-container">
              @if (currentImage(); as img) {
                <img
                  [src]="img.url"
                  [alt]="breed.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              }
              @if (images().length > 1) {
                <div class="absolute bottom-6 right-6 flex gap-2">
                  <button
                    (click)="prev()"
                    aria-label="Previous image"
                    class="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-surface-container-lowest transition-colors"
                  >
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    (click)="next()"
                    aria-label="Next image"
                    class="w-10 h-10 rounded-full bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-surface-container-lowest transition-colors"
                  >
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              }
            </div>
            <!-- Thumbnails -->
            <div class="flex gap-unit overflow-x-auto hide-scrollbar py-2">
              @for (img of images(); track img.id; let i = $index) {
                <div
                  (click)="goTo(i)"
                  class="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer transition-opacity"
                  [class]="i === imageIndex() ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'"
                >
                  <img [src]="img.url" [alt]="breed.name + ' thumbnail'" class="w-full h-full object-cover" />
                </div>
              }
            </div>
          </div>

          <!-- Info Card -->
          <div class="lg:col-span-5 flex flex-col gap-gutter">
            <div class="bg-surface-container-lowest rounded-xl p-8 ambient-shadow-1 h-full flex flex-col">
              <div class="mb-6">
                <h2 class="text-[32px] leading-tight text-primary font-bold mb-2">{{ breed.name }}</h2>
                <p class="text-body-md text-secondary">{{ breed.description }}</p>
              </div>

              <div class="flex flex-wrap gap-2 mb-8">
                @for (trait of traits(); track trait) {
                  <span
                    class="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-label-caps tracking-wider uppercase"
                    >{{ trait }}</span
                  >
                }
              </div>

              <div class="grid grid-cols-2 gap-6 mb-8 flex-grow">
                <div>
                  <div class="flex items-center gap-2 text-primary mb-1">
                    <span class="material-symbols-outlined text-[20px]">public</span>
                    <span class="text-label-caps uppercase tracking-wider">Origin</span>
                  </div>
                  <p class="text-body-md text-on-surface">{{ breed.origin }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 text-primary mb-1">
                    <span class="material-symbols-outlined text-[20px]">hourglass_empty</span>
                    <span class="text-label-caps uppercase tracking-wider">Life Span</span>
                  </div>
                  <p class="text-body-md text-on-surface">{{ breed.life_span }} Years</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 text-primary mb-1">
                    <span class="material-symbols-outlined text-[20px]">scale</span>
                    <span class="text-label-caps uppercase tracking-wider">Weight</span>
                  </div>
                  <p class="text-body-md text-on-surface">{{ breed.weight.metric }} kg</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 text-primary mb-1">
                    <span class="material-symbols-outlined text-[20px]">favorite</span>
                    <span class="text-label-caps uppercase tracking-wider">Temperament</span>
                  </div>
                  <p class="text-body-md text-on-surface line-clamp-2">{{ breed.temperament }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-label-caps uppercase text-secondary">Energy Level</span>
                  </div>
                  <div class="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full rounded-full" [style.width.%]="toPercent(breed.energy_level)"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-label-caps uppercase text-secondary">Affection Level</span>
                  </div>
                  <div class="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
                    <div class="bg-primary h-full rounded-full" [style.width.%]="toPercent(breed.affection_level)"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class BreedExplorer {
  private readonly breedService = inject(BreedService);
  private readonly imageService = inject(ImageService);

  protected readonly breeds = signal<Breed[]>([]);
  protected readonly selectedId = signal<string>('');
  protected readonly selectedBreed = signal<Breed | null>(null);
  protected readonly images = signal<CatImage[]>([]);
  protected readonly imageIndex = signal(0);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly currentImage = computed<CatImage | null>(
    () => this.images()[this.imageIndex()] ?? null,
  );

  protected readonly traits = computed(() =>
    (this.selectedBreed()?.temperament ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 3),
  );

  constructor() {
    this.breedService.getAll().subscribe({
      next: (breeds) => this.breeds.set(breeds),
      error: () => this.error.set('No se pudieron cargar las razas'),
    });
  }

  onSelect(breedId: string): void {
    if (!breedId) return;
    this.selectedId.set(breedId);
    this.loading.set(true);
    this.error.set(null);
    this.imageIndex.set(0);

    this.breedService.getById(breedId).subscribe({
      next: (breed) => {
        this.selectedBreed.set(breed);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la raza seleccionada');
        this.loading.set(false);
      },
    });

    this.imageService.getByBreedId(breedId).subscribe({
      next: (imgs) => this.images.set(imgs),
      error: () => this.images.set([]),
    });
  }

  toPercent(value: number | undefined): number {
    return value ? (value / 5) * 100 : 0;
  }

  next(): void {
    this.imageIndex.update((i) => (i + 1) % this.images().length);
  }

  prev(): void {
    this.imageIndex.update((i) => (i - 1 + this.images().length) % this.images().length);
  }

  goTo(index: number): void {
    this.imageIndex.set(index);
  }
}
