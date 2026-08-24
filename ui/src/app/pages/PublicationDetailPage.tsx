import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";

import { getPublicationById } from "../services/publicationService";
import type { Publication } from "../types/Publication";

export default function PublicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const loadPublication = async () => {
      if (!id) {
        setError("No se encontró el ID de la publicación.");
        setLoading(false);
        return;
      }

      try {
        const data = await getPublicationById(Number(id));
        setPublication(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la publicación.");
      } finally {
        setLoading(false);
      }
    };

    loadPublication();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#8892a4" }}>Cargando publicación...</p>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#ef4444" }}>
          {error || "Publicación no encontrada."}
        </p>
      </div>
    );
  }

  const images =
    publication.imageUris && publication.imageUris.length > 0
      ? publication.imageUris
      : [
          "https://placehold.co/600x600/161b27/8892a4?text=Sin+imagen",
        ];

  const previousImage = () => {
    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="flex-1 max-w-[1250px] mx-auto w-full px-5 py-8">
      {/* Breadcrumb */}
      <div
        className="flex items-center gap-2 text-[12px] mb-7"
        style={{ color: "#6f7890" }}
      >
        <button onClick={() => navigate("/")}>Inicio</button>
        <span>›</span>
        <button onClick={() => navigate("/explore")}>Explorar</button>
        <span>›</span>
        <span style={{ color: "#c4c8d8" }}>
          {publication.albumName || publication.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_250px] gap-7">
        {/* IZQUIERDA - GALERÍA */}
        <section>
          <div
            className="relative rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.08)",
              aspectRatio: "1 / 1",
            }}
          >
            <img
              src={images[selectedImage]}
              alt={publication.albumName || publication.name}
              className="w-full h-full object-cover"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={previousImage}
                  className="absolute left-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(15,17,23,0.8)",
                    color: "#e8eaf0",
                  }}
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(15,17,23,0.8)",
                    color: "#e8eaf0",
                  }}
                >
                  <ChevronRight size={17} />
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {images.slice(0, 3).map((image, index) => (
              <button
                key={image + index}
                onClick={() => setSelectedImage(index)}
                className="rounded overflow-hidden"
                style={{
                  border:
                    selectedImage === index
                      ? "2px solid #f59e0b"
                      : "1px solid rgba(255,255,255,0.08)",
                  aspectRatio: "1 / 1",
                  background: "#161b27",
                }}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/explore")}
            className="flex items-center gap-1 mt-5 text-[12px] hover:opacity-80"
            style={{ color: "#8892a4" }}
          >
            <ArrowLeft size={13} />
            Volver a resultados
          </button>
        </section>

        {/* CENTRO - INFORMACIÓN PRINCIPAL */}
        <main>
          <h1
            className="text-3xl font-bold mb-1"
            style={{ color: "#e8eaf0" }}
          >
            {publication.albumName || publication.name}
          </h1>

          <p
            className="text-[16px] mb-6"
            style={{ color: "#8892a4" }}
          >
            {publication.artist || "Artista no especificado"}
          </p>

          <p
            className="text-3xl font-bold mb-2"
            style={{ color: "#f59e0b" }}
          >
            USD {Number(publication.price).toFixed(2)}
          </p>

          <div
            className="text-[12px] mb-6 flex gap-4"
            style={{ color: "#6f7890" }}
          >
            <span>Publicado: {publication.createdAt}</span>
            <span>·</span>
            <span>ID: #{publication.id}</span>
          </div>

          <section className="mb-7">
            <h2
              className="text-[14px] font-semibold mb-3"
              style={{ color: "#e8eaf0" }}
            >
              Descripción
            </h2>

            <p
              className="text-[14px] leading-7"
              style={{ color: "#a2aabd" }}
            >
              {publication.description || "Sin descripción."}
            </p>
          </section>

          <div
            className="flex items-center gap-2 text-[13px] mb-7"
            style={{ color: "#8892a4" }}
          >
            <MapPin size={15} />
            Ubicación: No especificada
          </div>

          <div
            className="pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              className="w-full max-w-[320px] py-3 rounded text-[13px] font-semibold flex items-center justify-center gap-2"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              <MessageCircle size={16} />
              Contactar vendedor
            </button>

            <button
              className="mt-4 flex items-center gap-2 text-[13px]"
              style={{ color: "#8892a4" }}
            >
              <Heart size={16} />
              Agregar a favoritos
            </button>
          </div>
        </main>

        {/* DERECHA - PANEL LATERAL */}
        <aside
          className="rounded-lg p-5 h-fit"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SidebarSection number="1" title="Galería">
            <p className="text-[12px]" style={{ color: "#8892a4" }}>
              {images.length} imagen{images.length !== 1 ? "es" : ""} del producto.
            </p>
          </SidebarSection>

          <SidebarSection number="2" title="Vendedor">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#232a3a" }}
              >
                <User size={17} style={{ color: "#8892a4" }} />
              </div>

              <div>
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "#e8eaf0" }}
                >
                  {publication.user?.name || "Usuario no disponible"}
                </p>

                <p
                  className="text-[11px]"
                  style={{ color: "#6f7890" }}
                >
                  Vendedor
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="mt-3 text-[12px] font-semibold"
              style={{ color: "#f59e0b" }}
            >
              Ver perfil →
            </button>
          </SidebarSection>

          <SidebarSection number="3" title="Información adicional">
            <InfoRow
              label="Formato"
              value={publication.format || "No especificado"}
            />
            <InfoRow
              label="Estado"
              value={
                publication.condition
                  ? publication.condition.replaceAll("_", " ")
                  : "No especificado"
              }
            />
            <InfoRow
              label="Año"
              value={publication.releaseYear?.toString() || "No especificado"}
            />
            <InfoRow
              label="Género"
              value={publication.genre || "No especificado"}
            />
          </SidebarSection>

          <SidebarSection number="4" title="Acciones">
            <button
              className="w-full py-2.5 rounded text-[12px] font-semibold flex items-center justify-center gap-2"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              <MessageCircle size={14} />
              Contactar vendedor
            </button>

            <button
              className="w-full py-2.5 rounded mt-2 text-[12px] flex items-center justify-center gap-2"
              style={{
                background: "#1e2433",
                color: "#c4c8d8",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Heart size={14} />
              Agregar a favoritos
            </button>

            <button
              className="w-full py-2 mt-2 text-[12px] flex items-center justify-center gap-2"
              style={{ color: "#8892a4" }}
            >
              <Share2 size={14} />
              Compartir
            </button>
          </SidebarSection>
        </aside>
      </div>
    </div>
  );
}

function SidebarSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-8 pb-6 last:pb-0">
      <div
        className="absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{
          background: "#f59e0b",
          color: "#0f1117",
        }}
      >
        {number}
      </div>

      <h3
        className="text-[11px] uppercase tracking-wider font-semibold mb-3"
        style={{ color: "#8892a4" }}
      >
        {title}
      </h3>

      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 text-[12px] mb-2">
      <span style={{ color: "#6f7890" }}>{label}</span>
      <span
        className="text-right"
        style={{ color: "#c4c8d8" }}
      >
        {value}
      </span>
    </div>
  );
}