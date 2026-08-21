export interface Publication {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  imageUris?: string[];
  albumName?: string;
  artist?: string;
  genre?: string;
  releaseYear?: number;
  condition?: string;
  price: number;
}