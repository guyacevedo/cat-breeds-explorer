/** Pure data types for the breeds domain (Model layer). */

export interface BreedWeight {
  imperial: string;
  metric: string;
}

/** Subset of TheCatAPI breed shape relevant for this app. */
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
