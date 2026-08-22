import type { Publication } from "../types/Publication";

const API_URL = "http://localhost:8080/api/publications";

export async function getPublications(): Promise<Publication[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Error al obtener publicaciones: ${response.status}`);
  }

  return response.json();
}

export async function getPublicationsByUser(userId: number): Promise<Publication[]> {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error(`Error al obtener publicaciones del usuario: ${response.status}`);
  }

  return response.json();
}

export async function deletePublication(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar publicación: ${response.status}`);
  }
}

export async function getPublicationById(id: number): Promise<Publication> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener publicación: ${response.status}`);
  }

  return response.json();
}

export async function updatePublication(
  id: number,
  publication: Publication
): Promise<Publication> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(publication),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar publicación: ${response.status}`);
  }

  return response.json();
}

export async function createPublication(
  publication: Omit<Publication, "id" | "createdAt">
): Promise<Publication> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(publication),
  });

  if (!response.ok) {
    throw new Error(`Error al crear publicación: ${response.status}`);
  }

  return response.json();
}