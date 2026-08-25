import { useEffect, useMemo, useState } from "react";
import {
  Disc3,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router";

import type { Publication } from "../types/Publication";

import {
  deletePublication,
  getPublicationsByUser,
} from "../services/publicationService";

import PublicationCard from "../components/publications/PublicationCard";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [publications, setPublications] =
    useState<Publication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    publicationToDelete,
    setPublicationToDelete,
  ] = useState<Publication | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    const loadPublications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getPublicationsByUser(
            user.id
          );

        setPublications(data);
      } catch (err) {
        console.error(err);

        setError(
          "No se pudieron cargar tus publicaciones."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, [user]);

  const filteredPublications =
    useMemo(() => {
      const term =
        search.trim().toLowerCase();

      if (!term) {
        return publications;
      }

      return publications.filter(
        (publication) =>
          publication.name
            ?.toLowerCase()
            .includes(term) ||
          publication.albumName
            ?.toLowerCase()
            .includes(term) ||
          publication.artist
            ?.toLowerCase()
            .includes(term) ||
          publication.genre
            ?.toLowerCase()
            .includes(term) ||
          publication.format
            ?.toLowerCase()
            .includes(term)
      );
    }, [publications, search]);

  const handleEdit = (
    publication: Publication
  ) => {
    navigate(
      `/publications/${publication.id}/edit`
    );
  };

  const handleDeleteRequest = (
    publication: Publication
  ) => {
    setPublicationToDelete(
      publication
    );
  };

  const handleDeleteConfirm =
    async () => {
      if (!publicationToDelete) {
        return;
      }

      try {
        setDeleting(true);
        setError("");

        await deletePublication(
          publicationToDelete.id
        );

        setPublications((prev) =>
          prev.filter(
            (item) =>
              item.id !==
              publicationToDelete.id
          )
        );

        setPublicationToDelete(
          null
        );
      } catch (err) {
        console.error(err);

        setError(
          "No se pudo eliminar la publicación."
        );
      } finally {
        setDeleting(false);
      }
    };

  if (loading) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div
          className="rounded-lg p-10 text-center"
          style={{
            background:
              "#161b27",

            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-[13px]"
            style={{
              color: "#8892a4",
            }}
          >
            Cargando publicaciones...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Disc3
              size={26}
              style={{
                color:
                  "#f59e0b",
              }}
            />

            <h1
              className="text-2xl font-bold"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Mis publicaciones
            </h1>
          </div>

          <p
            className="text-[13px]"
            style={{
              color:
                "#8892a4",
            }}
          >
            Administra los productos que
            tienes publicados en Music
            Market.
          </p>

          <p
            className="text-[11px] mt-2"
            style={{
              color:
                "#6f7890",
            }}
          >
            {publications.length}{" "}
            publicación
            {publications.length !== 1
              ? "es"
              : ""}{" "}
            activa
            {publications.length !== 1
              ? "s"
              : ""}
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/publish")
          }
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded text-[13px] font-semibold"
          style={{
            background:
              "#f59e0b",

            color:
              "#0f1117",
          }}
        >
          <Plus size={15} />
          Nueva publicación
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          className="rounded-lg p-4 mb-6 text-[13px]"
          style={{
            background:
              "rgba(239,68,68,0.08)",

            color:
              "#ef4444",

            border:
              "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* BUSCADOR */}

      {publications.length > 0 && (
        <div
          className="rounded-lg p-4 mb-6"
          style={{
            background:
              "#161b27",

            border:
              "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded"
            style={{
              background:
                "#1e2433",

              border:
                "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Search
              size={15}
              style={{
                color:
                  "#6f7890",
              }}
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Buscar por álbum, artista, género o formato..."
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{
                color:
                  "#e8eaf0",
              }}
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-[11px] hover:text-white"
                style={{
                  color:
                    "#8892a4",
                }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}

      {/* SIN PUBLICACIONES */}

      {!error &&
        publications.length ===
          0 && (
          <div
            className="rounded-lg p-10 text-center"
            style={{
              background:
                "#161b27",

              border:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                background:
                  "#1e2433",

                color:
                  "#f59e0b",
              }}
            >
              <Disc3 size={25} />
            </div>

            <h2
              className="text-lg font-semibold mb-2"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Todavía no tienes
              publicaciones
            </h2>

            <p
              className="text-[13px] mb-5"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Publica tu primer vinilo, CD
              o cassette para comenzar.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/publish"
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-[13px] font-semibold"
              style={{
                background:
                  "#f59e0b",

                color:
                  "#0f1117",
              }}
            >
              <Plus size={15} />
              Crear publicación
            </button>
          </div>
        )}

      {/* SIN RESULTADOS DE BÚSQUEDA */}

      {!error &&
        publications.length > 0 &&
        filteredPublications.length ===
          0 && (
          <div
            className="rounded-lg p-10 text-center"
            style={{
              background:
                "#161b27",

              border:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Search
              size={24}
              className="mx-auto mb-3"
              style={{
                color:
                  "#6f7890",
              }}
            />

            <h3
              className="text-[15px] font-semibold mb-2"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              No se encontraron
              publicaciones
            </h3>

            <p
              className="text-[12px] mb-4"
              style={{
                color:
                  "#8892a4",
              }}
            >
              No encontramos resultados
              para "{search}".
            </p>

            <button
              onClick={() =>
                setSearch("")
              }
              className="px-4 py-2 rounded text-[12px] font-semibold"
              style={{
                background:
                  "#1e2433",

                color:
                  "#c4c8d8",

                border:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

      {/* PUBLICACIONES */}

      {!error &&
        filteredPublications.length >
          0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {filteredPublications.map(
              (
                publication
              ) => (
                <PublicationCard
                  key={
                    publication.id
                  }
                  publication={
                    publication
                  }
                  showActions
                  onEdit={
                    handleEdit
                  }
                  onDelete={
                    handleDeleteRequest
                  }
                />
              )
            )}

          </div>
        )}

      {/* MODAL ELIMINAR */}

      <AlertDialog
        open={
          publicationToDelete !==
          null
        }
        onOpenChange={(open) => {
          if (
            !open &&
            !deleting
          ) {
            setPublicationToDelete(
              null
            );
          }
        }}
      >
        <AlertDialogContent
          style={{
            background:
              "#161b27",

            border:
              "1px solid rgba(255,255,255,0.1)",

            color:
              "#e8eaf0",
          }}
        >
          <AlertDialogHeader>

            <AlertDialogTitle>
              ¿Eliminar publicación?
            </AlertDialogTitle>

            <AlertDialogDescription
              style={{
                color:
                  "#8892a4",
              }}
            >
              Estás a punto de eliminar{" "}
              <strong
                style={{
                  color:
                    "#e8eaf0",
                }}
              >
                {publicationToDelete
                  ?.albumName ||
                  publicationToDelete
                    ?.name}
              </strong>
              . Esta acción no se puede
              deshacer.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              disabled={deleting}
              style={{
                background:
                  "#1e2433",

                color:
                  "#c4c8d8",

                border:
                  "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={
                handleDeleteConfirm
              }
              style={{
                background:
                  "#991b1b",

                color:
                  "#ffffff",
              }}
            >
              {deleting
                ? "Eliminando..."
                : "Eliminar"}
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}