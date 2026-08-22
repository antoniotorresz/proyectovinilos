import { useEffect, useState } from "react";
import type { Publication } from "../types/Publication";
import { deletePublication, getPublicationsByUser } from "../services/publicationService";
import PublicationCard from "../components/publications/PublicationCard";
import { useNavigate } from "react-router";

export default function MyPublicationsPage() {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await getPublicationsByUser(1);
        setPublications(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tus publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  const handleEdit = (publication: Publication) => {
    navigate(`/publications/${publication.id}/edit`);
};

  const handleDelete = async (publication: Publication) => {
    const confirmed = window.confirm(
        `¿Seguro que quieres eliminar "${publication.albumName || publication.name}"?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await deletePublication(publication.id);

        setPublications((prev) =>
        prev.filter((item) => item.id !== publication.id)
        );
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar la publicación.");
    }
 };

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Mis publicaciones</h1>
        <p style={{ color: "#8892a4" }}>
          Administra los productos que tienes publicados en Music Market.
        </p>
      </div>

      {loading && (
        <p style={{ color: "#8892a4" }}>
          Cargando publicaciones...
        </p>
      )}

      {!loading && error && (
        <p style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}

      {!loading && !error && publications.length === 0 && (
        <div
          className="rounded-lg p-8 text-center"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="mb-2 font-semibold">
            Todavía no tienes publicaciones
          </p>

          <p
            className="text-[13px]"
            style={{ color: "#8892a4" }}
          >
            Publica tu primer vinilo, CD o cassette para comenzar.
          </p>
        </div>
      )}

      {!loading && !error && publications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {publications.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              showActions
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}