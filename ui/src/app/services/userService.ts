import { buildApiUrl } from "./api";
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  provider: "LOCAL" | "GOOGLE";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
const API_URL = buildApiUrl("/users");

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Error al obtener usuarios: ${response.status}`
    );
  }

  return response.json();
}

export async function getUserById(
  id: number
): Promise<User> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(
      `Error al obtener usuario: ${response.status}`
    );
  }

  return response.json();
}

export async function getUserByEmail(
  email: string
): Promise<User> {
  const response = await fetch(
    `${API_URL}/email?email=${encodeURIComponent(email)}`
  );

  if (!response.ok) {
    throw new Error(
      `Usuario no encontrado: ${response.status}`
    );
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
    throw new Error(
      `Error al actualizar usuario: ${response.status}`
    );
  }

  return response.json();
}

export async function loginUser(
  credentials: LoginRequest
): Promise<User> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error(
      `Error al iniciar sesión: ${response.status}`
    );
  }

  return response.json();
}

export async function registerUser(
  data: RegisterRequest
): Promise<User> {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      `Error al registrar usuario: ${response.status}`
    );
  }

  return response.json();
}

export async function updateUserRole(
  id: number,
  role: "USER" | "ADMIN"
): Promise<User> {
  const response = await fetch(
    `${API_URL}/${id}/role?role=${role}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error al actualizar rol: ${response.status}`
    );
  }

  return response.json();
}

export async function changePassword(
  id: number,
  data: ChangePasswordRequest
): Promise<void> {
  const response = await fetch(
    `${API_URL}/${id}/password`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error al cambiar contraseña: ${response.status}`
    );
  }
}