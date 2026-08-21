import type { Publication } from "../types/Publication";

const API_URL = "http://localhost:8080/api/publications";

export async function getPublications(): Promise<Publication[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Error al obtener publicaciones: ${response.status}`);
  }

  return response.json();
}