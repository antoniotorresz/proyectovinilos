import type { Publication } from "../types/Publication";
import { buildApiUrl } from "./api";

const API_URL = buildApiUrl("/publications");

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string | string[];
}

export interface PublicationFilters extends PaginationParams {
  q?: string;
  genre?: string;
  format?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
}

function appendPaginationParams(
  params: URLSearchParams,
  pagination?: PaginationParams
) {
  if (pagination?.page !== undefined) {
    params.append("page", pagination.page.toString());
  }

  if (pagination?.size !== undefined) {
    params.append("size", pagination.size.toString());
  }

  if (pagination?.sort) {
    if (Array.isArray(pagination.sort)) {
      pagination.sort.forEach((sort) => {
        params.append("sort", sort);
      });
    } else {
      params.append("sort", pagination.sort);
    }
  }
}

/*
 * ============================================================
 * PUBLICACIONES PAGINADAS
 * ============================================================
 */

export async function getPublicationsPage(
  pagination: PaginationParams = {}
): Promise<PageResponse<Publication>> {
  const params = new URLSearchParams();

  appendPaginationParams(params, pagination);

  const url = params.toString()
    ? `${API_URL}?${params.toString()}`
    : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error al obtener publicaciones: ${response.status}`
    );
  }

  return response.json();
}

/*
 * Esta función se conserva para las páginas que todavía esperan
 * Publication[].
 *
 * Traemos una cantidad suficientemente grande temporalmente.
 * Después Explore, MyPublications y Admin usarán getPublicationsPage().
 */
export async function getPublications(): Promise<Publication[]> {
  const page = await getPublicationsPage({
    page: 0,
    size: 1000,
  });

  return page.content;
}

/*
 * ============================================================
 * PUBLICACIONES POR USUARIO
 * ============================================================
 */

export async function getPublicationsByUserPage(
  userId: number,
  pagination: PaginationParams = {}
): Promise<PageResponse<Publication>> {
  const params = new URLSearchParams();

  appendPaginationParams(params, pagination);

  const url = params.toString()
    ? `${API_URL}/user/${userId}?${params.toString()}`
    : `${API_URL}/user/${userId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Error al obtener publicaciones del usuario: ${response.status}`
    );
  }

  const data = await response.json();

  /*
   * Compatibilidad:
   * si el endpoint todavía devuelve Publication[],
   * lo convertimos a PageResponse.
   */
  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
      first: true,
      last: true,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }

  return data;
}

export async function getPublicationsByUser(
  userId: number
): Promise<Publication[]> {
  const page = await getPublicationsByUserPage(userId, {
    page: 0,
    size: 1000,
  });

  return page.content;
}

/*
 * ============================================================
 * CRUD
 * ============================================================
 */

export async function deletePublication(
  id: number
): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Error al eliminar publicación: ${response.status}`
    );
  }
}

export async function getPublicationById(
  id: number
): Promise<Publication> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(
      `Error al obtener publicación: ${response.status}`
    );
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
    throw new Error(
      `Error al actualizar publicación: ${response.status}`
    );
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
    throw new Error(
      `Error al crear publicación: ${response.status}`
    );
  }

  return response.json();
}

/*
 * ============================================================
 * BÚSQUEDA
 * ============================================================
 */

export async function searchPublicationsPage(
  query: string,
  pagination: PaginationParams = {}
): Promise<PageResponse<Publication>> {
  const params = new URLSearchParams();

  params.append("q", query);

  appendPaginationParams(params, pagination);

  const response = await fetch(
    `${API_URL}/search?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al buscar publicaciones: ${response.status}`
    );
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
      first: true,
      last: true,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }

  return data;
}

export async function searchPublications(
  query: string
): Promise<Publication[]> {
  const page = await searchPublicationsPage(query, {
    page: 0,
    size: 1000,
  });

  return page.content;
}

/*
 * ============================================================
 * GÉNERO
 * ============================================================
 */

export async function getPublicationsByGenrePage(
  genre: string,
  pagination: PaginationParams = {}
): Promise<PageResponse<Publication>> {
  const params = new URLSearchParams();

  params.append("name", genre);

  appendPaginationParams(params, pagination);

  const response = await fetch(
    `${API_URL}/search/genre?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al buscar publicaciones por género: ${response.status}`
    );
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
      first: true,
      last: true,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }

  return data;
}

export async function getPublicationsByGenre(
  genre: string
): Promise<Publication[]> {
  const page = await getPublicationsByGenrePage(genre, {
    page: 0,
    size: 1000,
  });

  return page.content;
}

/*
 * ============================================================
 * FILTROS
 * ============================================================
 */

export async function filterPublicationsPage(
  filters: PublicationFilters
): Promise<PageResponse<Publication>> {
  const params = new URLSearchParams();

  if (filters.q) {
    params.append("q", filters.q);
  }

  if (filters.genre) {
    params.append("genre", filters.genre);
  }

  if (filters.format) {
    params.append("format", filters.format);
  }

  if (filters.condition) {
    params.append("condition", filters.condition);
  }

  if (filters.minPrice !== undefined) {
    params.append(
      "minPrice",
      filters.minPrice.toString()
    );
  }

  if (filters.maxPrice !== undefined) {
    params.append(
      "maxPrice",
      filters.maxPrice.toString()
    );
  }

  appendPaginationParams(params, filters);

  const response = await fetch(
    `${API_URL}/filter?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(
      `Error al filtrar publicaciones: ${response.status}`
    );
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return {
      content: data,
      totalElements: data.length,
      totalPages: 1,
      number: 0,
      size: data.length,
      first: true,
      last: true,
      numberOfElements: data.length,
      empty: data.length === 0,
    };
  }

  return data;
}

export async function filterPublications(
  filters: PublicationFilters
): Promise<Publication[]> {
  const page = await filterPublicationsPage({
    ...filters,
    page: 0,
    size: 1000,
  });

  return page.content;
}