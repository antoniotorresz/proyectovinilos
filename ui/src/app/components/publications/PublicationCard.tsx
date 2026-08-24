import type { Publication } from "../../types/Publication";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();
  
  return (
    <div
      className="rounded-lg overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        background: "#1a1f2e",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="relative w-full" style={{ paddingTop: "70%" }}>
        <img
          src={publication.imageUris?.[0]}
          alt={publication.albumName || publication.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {publication.condition && (
          <span
            className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
            style={{
              background:
                publication.condition === "MINT"
                  ? "#f59e0b"
                  : "rgba(0,0,0,0.6)",
              color:
                publication.condition === "MINT"
                  ? "#0f1117"
                  : "#c4c8d8",
              border:
                publication.condition === "MINT"
                  ? undefined
                  : "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {publication.condition}
          </span>
        )}
      </div>

      <div className="p-4">
        <div
          className="text-[14px] font-semibold leading-tight mb-0.5"
          style={{ color: "#e8eaf0" }}
        >
          {publication.albumName || publication.name}
        </div>

        <div
          className="text-[12px] mb-3"
          style={{ color: "#8892a4" }}
        >
          {publication.artist}
        </div>

        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[15px] font-bold"
            style={{ color: "#f59e0b" }}
          >
            USD {publication.price.toFixed(2)}
          </span>
        </div>

        {showActions ? (
          <div className="space-y-2">
            <button
              onClick={() => navigate(`/publications/${publication.id}`)}
              className="w-full text-[13px] font-medium py-2 rounded transition-opacity hover:opacity-80"
              style={{
                background: "#1e2433",
                color: "#c4c8d8",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Ver detalles
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(publication)}
                className="flex-1 text-[13px] font-medium py-2 rounded transition-opacity hover:opacity-80"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Editar
              </button>

              <button
                onClick={() => onDelete?.(publication)}
                className="flex-1 text-[13px] font-medium py-2 rounded transition-opacity hover:opacity-80"
                style={{
                  background: "#7f1d1d",
                  color: "#ffffff",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate(`/publications/${publication.id}`)}
            className="w-full text-[13px] font-medium py-2 rounded transition-colors hover:opacity-80"
            style={{
              background: "#1e2433",
              color: "#c4c8d8",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
}