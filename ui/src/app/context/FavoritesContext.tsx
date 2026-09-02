import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  addFavorite,
  getFavoritePublicationIds,
  removeFavorite,
} from "../services/favoriteService";

interface FavoritesContextType {
  favoriteIds: number[];
  loadingFavorites: boolean;
  isFavorite: (publicationId: number) => boolean;
  toggleFavorite: (publicationId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext =
  createContext<FavoritesContextType | undefined>(
    undefined
  );

export function FavoritesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const [favoriteIds, setFavoriteIds] =
    useState<number[]>([]);

  const [loadingFavorites, setLoadingFavorites] =
    useState(false);

  const refreshFavorites = async () => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }

    try {
      setLoadingFavorites(true);

      const ids =
        await getFavoritePublicationIds(
          user.id
        );

      setFavoriteIds(ids);
    } catch (error) {
      console.error(
        "Error al cargar favoritos:",
        error
      );
    } finally {
      setLoadingFavorites(false);
    }
  };

  useEffect(() => {
    refreshFavorites();
  }, [user?.id]);

  const isFavorite = (
    publicationId: number
  ) => {
    return favoriteIds.includes(
      publicationId
    );
  };

  const toggleFavorite = async (
    publicationId: number
  ) => {
    if (!user) {
      return;
    }

    const currentlyFavorite =
      favoriteIds.includes(
        publicationId
      );

    try {
      if (currentlyFavorite) {
        await removeFavorite(
          user.id,
          publicationId
        );

        setFavoriteIds(
          (prev) =>
            prev.filter(
              (id) =>
                id !==
                publicationId
            )
        );
      } else {
        await addFavorite(
          user.id,
          publicationId
        );

        setFavoriteIds(
          (prev) =>
            prev.includes(
              publicationId
            )
              ? prev
              : [
                  ...prev,
                  publicationId,
                ]
        );
      }
    } catch (error) {
      console.error(
        "Error al actualizar favorito:",
        error
      );

      throw error;
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        loadingFavorites,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context =
    useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites debe utilizarse dentro de FavoritesProvider"
    );
  }

  return context;
}