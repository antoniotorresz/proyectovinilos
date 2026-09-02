import type { Publication } from "../types/Publication";
import { buildApiUrl } from "./api";


const API_URL = buildApiUrl("/favorites");

export interface Favorite {
  id?: number;

  user?: {
    id: number;
    name?: string;
    email?: string;
  };

  publication: Publication;
}

/*
 * ============================================================
 * OBTENER FAVORITOS DE UN USUARIO
 * ============================================================
 */

export async function getFavoritesByUser(
  userId: number
): Promise<Favorite[]> {
  const response = await fetch(
    `${API_URL}/${userId}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener favoritos: ${response.status}`
    );
  }

  return response.json();
}

/*
 * ============================================================
 * AGREGAR FAVORITO
 * ============================================================
 */

export async function addFavorite(
  userId: number,
  publicationId: number
): Promise<Favorite> {
  const params = new URLSearchParams();

  params.append(
    "userId",
    userId.toString()
  );

  params.append(
    "publicationId",
    publicationId.toString()
  );

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error al agregar favorito: ${response.status}`
    );
  }

  return response.json();
}

/*
 * ============================================================
 * ELIMINAR FAVORITO
 * ============================================================
 */

export async function removeFavorite(
  userId: number,
  publicationId: number
): Promise<void> {
  const params = new URLSearchParams();

  params.append(
    "userId",
    userId.toString()
  );

  params.append(
    "publicationId",
    publicationId.toString()
  );

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error al eliminar favorito: ${response.status}`
    );
  }
}

/*
 * ============================================================
 * PUBLICACIONES FAVORITAS
 * ============================================================
 */

export async function getFavoritePublications(
  userId: number
): Promise<Publication[]> {
  const favorites =
    await getFavoritesByUser(
      userId
    );

  return favorites
    .map(
      (favorite) =>
        favorite.publication
    )
    .filter(Boolean);
}

/*
 * ============================================================
 * IDs DE PUBLICACIONES FAVORITAS
 * ============================================================
 */

export async function getFavoritePublicationIds(
  userId: number
): Promise<number[]> {
  const favorites =
    await getFavoritesByUser(
      userId
    );

  return favorites
    .map(
      (favorite) =>
        favorite.publication?.id
    )
    .filter(
      (
        id
      ): id is number =>
        typeof id === "number"
    );
}

/*
 * ============================================================
 * TOP DE FAVORITOS
 * ============================================================
 */

export async function getTopFavorites(
  limit = 10
): Promise<Favorite[]> {
  const response = await fetch(
    `${API_URL}/top?n=${limit}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener favoritos destacados: ${response.status}`
    );
  }

  return response.json();
}