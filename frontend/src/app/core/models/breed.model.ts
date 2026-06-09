/** Pure domain types for cat breeds (Model layer). */

export interface BreedWeight {
  imperial: string;
  metric: string;
}

export interface Breed {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  description: string;
  life_span: string;
  weight: BreedWeight;
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  dog_friendly?: number;
  energy_level?: number;
  intelligence?: number;
  reference_image_id?: string;
  wikipedia_url?: string;
}

/** Flattened view-model used by the data table. */
export interface BreedRow {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  life_span: string;
  weight: string;
}

export function toBreedRow(breed: Breed): BreedRow {
  return {
    id: breed.id,
    name: breed.name,
    origin: breed.origin,
    temperament: breed.temperament,
    life_span: breed.life_span,
    weight: breed.weight?.metric ? `${breed.weight.metric} kg` : '—',
  };
}
