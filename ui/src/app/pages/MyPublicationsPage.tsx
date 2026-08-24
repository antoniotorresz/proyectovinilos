import { useEffect, useState } from "react";
import type { Publication } from "../types/Publication";
import { deletePublication, getPublicationsByUser } from "../services/publicationService";
import PublicationCard from "../components/publications/PublicationCard";
import { useNavigate } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export default function MyPublicationsPage() {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publicationToDelete, setPublicationToDelete] = useState<Publication | null>(null);

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

const handleDelete = async () => {
  if (!publicationToDelete) {
    return;
  }

  try {
    await deletePublication(publicationToDelete.id);

    setPublications((prev) =>
      prev.filter((item) => item.id !== publicationToDelete.id)
    );

    setPublicationToDelete(null);
  } catch (err) {
    console.error(err);
    setError("No se pudo eliminar la publicación.");
  }
};

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Mis publicaciones
          </h1>

          <p style={{ color: "#8892a4" }}>
            Administra los productos que tienes publicados en Music Market.
          </p>
        </div>

        <button
          onClick={() => navigate("/publish")}
          className="px-5 py-2.5 rounded text-[13px] font-semibold transition-opacity hover:opacity-90"
          style={{
            background: "#f59e0b",
            color: "#0f1117",
          }}
        >
          Nueva publicación
        </button>
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
              onDelete={(publication) => setPublicationToDelete(publication)}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={publicationToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPublicationToDelete(null);
          }
        }}
      >
        <AlertDialogContent
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#e8eaf0",
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar publicación?
            </AlertDialogTitle>

            <AlertDialogDescription style={{ color: "#8892a4" }}>
              Estás a punto de eliminar{" "}
              <strong style={{ color: "#e8eaf0" }}>
                {publicationToDelete?.albumName ||
                  publicationToDelete?.name}
              </strong>
              . Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: "#1e2433",
                color: "#c4c8d8",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              style={{
                background: "#991b1b",
                color: "#ffffff",
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}