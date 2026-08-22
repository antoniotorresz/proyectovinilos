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
  format?: string;
  price: number;
  user?: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  } | null;
}