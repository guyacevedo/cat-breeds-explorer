/** Pure domain type for cat images (Model layer). */
export interface CatImage {
  id: string;
  url: string;
  width?: number;
  height?: number;
}
