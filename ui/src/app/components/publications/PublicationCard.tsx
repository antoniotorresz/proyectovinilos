import type { Publication } from "../../types/Publication";
import { Disc3, Eye, Pencil, Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import FavoriteButton from "../favorites/FavoriteButton";

interface PublicationCardProps {
  publication: Publication;
  showActions?: boolean;
  onEdit?: (publication: Publication) => void;
  onDelete?: (publication: Publication) => void;
}

export default function PublicationCard({
  publication,
  showActions = false,
  onEdit,
  onDelete,
}: PublicationCardProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const imageUrl =
    publication.imageUris && publication.imageUris.length > 0
      ? publication.imageUris[0]
      : "";

  const title =
    publication.albumName?.trim() ||
    publication.name?.trim() ||
    "Publicación sin título";

  const artist =
    publication.artist?.trim() ||
    "Artista no especificado";

  const conditionLabel = publication.condition
    ? publication.condition.replaceAll("_", " ")
    : "";

  const price = Number(publication.price);

  const goToDetails = () => {
    navigate(
      `/publications/${publication.id}`,
      {
        state: {
          returnTo:
            `${location.pathname}${location.search}`,
        },
      }
    );
  };

  return (
    <article
      className="rounded-lg overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        background: "#1a1f2e",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* IMAGEN */}

      <div
        className="relative w-full"
        style={{
          paddingTop: "70%",
          background: "#111722",
        }}
      >
        {/* Área clickeable de la imagen */}
        <button
          type="button"
          onClick={goToDetails}
          className="absolute inset-0 w-full h-full block text-left"
          aria-label={`Ver detalles de ${title}`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2"
              style={{
                color: "#6f7890",
              }}
            >
              <Disc3 size={32} />

              <span className="text-[11px]">
                Sin imagen
              </span>
            </div>
          )}

          {conditionLabel && (
            <span
              className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                background:
                  publication.condition === "MINT"
                    ? "#f59e0b"
                    : "rgba(15,17,23,0.82)",

                color:
                  publication.condition === "MINT"
                    ? "#0f1117"
                    : "#c4c8d8",

                border:
                  publication.condition === "MINT"
                    ? undefined
                    : "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {conditionLabel}
            </span>
          )}

          {publication.format && (
            <span
              className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded"
              style={{
                background: "rgba(15,17,23,0.82)",
                color: "#c4c8d8",
                border:
                  "1px solid rgba(255,255,255,0.18)",
              }}
            >
              {publication.format}
            </span>
          )}
        </button>

        {/* FAVORITO */}
        <div
          className="absolute top-2 left-2 z-10 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(15,17,23,0.88)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)",
          }}
        >
          <FavoriteButton
            publicationId={publication.id}
            size={17}
          />
        </div>
      </div>

      {/* INFORMACIÓN */}

      <div className="p-4">
        <button
          type="button"
          onClick={goToDetails}
          className="block w-full text-left"
        >
          <h3
            className="text-[14px] font-semibold leading-tight mb-1 line-clamp-1 hover:opacity-80"
            style={{
              color: "#e8eaf0",
            }}
          >
            {title}
          </h3>

          <p
            className="text-[12px] mb-3 line-clamp-1"
            style={{
              color: "#8892a4",
            }}
          >
            {artist}
          </p>
        </button>

        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className="text-[15px] font-bold"
            style={{
              color: "#f59e0b",
            }}
          >
            USD{" "}
            {Number.isFinite(price)
              ? price.toFixed(2)
              : "0.00"}
          </span>

          {publication.releaseYear && (
            <span
              className="text-[11px]"
              style={{
                color: "#6f7890",
              }}
            >
              {publication.releaseYear}
            </span>
          )}
        </div>

        {/* ACCIONES */}

        {showActions ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={goToDetails}
              className="w-full text-[13px] font-medium py-2 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
              style={{
                background: "#1e2433",
                color: "#c4c8d8",
                border:
                  "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Eye size={14} />
              Ver detalles
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onEdit?.(publication)
                }
                className="flex-1 text-[13px] font-medium py-2 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <Pencil size={13} />
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete?.(publication)
                }
                className="flex-1 text-[13px] font-medium py-2 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{
                  background: "#7f1d1d",
                  color: "#ffffff",
                }}
              >
                <Trash2 size={13} />
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={goToDetails}
            className="w-full text-[13px] font-medium py-2 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{
              background: "#1e2433",
              color: "#c4c8d8",
              border:
                "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Eye size={14} />
            Ver detalles
          </button>
        )}
      </div>
    </article>
  );
}