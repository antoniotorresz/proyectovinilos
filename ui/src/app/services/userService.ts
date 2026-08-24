export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const API_URL = "http://localhost:8080/api/users";

export async function getUserById(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Error al obtener usuario: ${response.status}`);
  }

  return response.json();
}

export async function updateUser(
  id: number,
  user: User
): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar usuario: ${response.status}`);
  }

  return response.json();
}

export async function getUserByEmail(email: string): Promise<User> {
  const response = await fetch(
    `${API_URL}/email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error(`Usuario no encontrado: ${response.status}`);
  }

  return response.json();
}