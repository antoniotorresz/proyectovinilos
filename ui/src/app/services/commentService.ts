import type { User } from "./userService";

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface CreateCommentRequest {
  content: string;

  user: {
    id: number;
  };

  publication: {
    id: number;
  };
}

const API_URL =
  "http://localhost:8080/api/comments";

export async function getCommentsByPublication(
  publicationId: number
): Promise<Comment[]> {
  const response = await fetch(
    `${API_URL}/publication/${publicationId}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener comentarios: ${response.status}`
    );
  }

  return response.json();
}

export async function createComment(
  data: CreateCommentRequest
): Promise<Comment> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Error al crear comentario: ${response.status}`
    );
  }

  return response.json();
}

export async function deleteComment(
  id: number
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error al eliminar comentario: ${response.status}`
    );
  }
}