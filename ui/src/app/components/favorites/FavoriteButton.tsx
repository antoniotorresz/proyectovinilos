import { Heart } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";

interface FavoriteButtonProps {
  publicationId: number;
  size?: number;
  showText?: boolean;
}

export default function FavoriteButton({
  publicationId,
  size = 18,
  showText = false,
}: FavoriteButtonProps) {
  const { user } = useAuth();

  const {
    isFavorite,
    toggleFavorite,
    loadingFavorites,
  } = useFavorites();

  const [updating, setUpdating] =
    useState(false);

  if (!user) {
    return null;
  }

  const favorite =
    isFavorite(
      publicationId
    );

  const handleFavorite = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      updating ||
      loadingFavorites
    ) {
      return;
    }

    try {
      setUpdating(true);

      await toggleFavorite(
        publicationId
      );
    } catch (error) {
      console.error(
        "No se pudo actualizar el favorito:",
        error
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={
        updating ||
        loadingFavorites
      }
      title={
        favorite
          ? "Quitar de favoritos"
          : "Agregar a favoritos"
      }
      aria-label={
        favorite
          ? "Quitar de favoritos"
          : "Agregar a favoritos"
      }
      className="flex items-center justify-center gap-2 rounded transition-all hover:opacity-80 disabled:opacity-50"
      style={{
        color: favorite
          ? "#f59e0b"
          : "#8892a4",
      }}
    >
      <Heart
        size={size}
        fill={
          favorite
            ? "currentColor"
            : "none"
        }
      />

      {showText && (
        <span className="text-[12px] font-medium">
          {favorite
            ? "En favoritos"
            : "Agregar a favoritos"}
        </span>
      )}
    </button>
  );
}