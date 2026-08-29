import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Disc3,
  Edit3,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Send,
  Share2,
  ShieldCheck,
  Tag,
  Trash2,
  User,
} from "lucide-react";

import { getPublicationById } from "../services/publicationService";
import type { Publication } from "../types/Publication";

import {
  createComment,
  deleteComment,
  getCommentsByPublication,
} from "../services/commentService";
import type { Comment } from "../services/commentService";

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

export default function PublicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentSaving, setCommentSaving] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      if (!id) {
        setError("No se encontró el ID de la publicación.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setCommentsLoading(true);
        setError("");

        const publicationId = Number(id);

        const [publicationData, commentsData] = await Promise.all([
          getPublicationById(publicationId),
          getCommentsByPublication(publicationId),
        ]);

        setPublication(publicationData);
        setComments(commentsData);
        setSelectedImage(0);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la publicación.");
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };

    loadPage();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div
          className="rounded-lg p-10 text-center"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[13px]" style={{ color: "#8892a4" }}>
            Cargando publicación...
          </p>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">
        <div
          className="rounded-lg p-10 text-center"
          style={{
            background: "#161b27",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className="mb-5" style={{ color: "#ef4444" }}>
            {error || "Publicación no encontrada."}
          </p>

          <button
            onClick={() => navigate("/explore")}
            className="px-5 py-2.5 rounded text-[13px] font-semibold"
            style={{
              background: "#f59e0b",
              color: "#0f1117",
            }}
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  const images =
    publication.imageUris && publication.imageUris.length > 0
      ? publication.imageUris
      : ["https://placehold.co/600x600/161b27/8892a4?text=Sin+imagen"];

  const isOwner = Boolean(user) && publication.user?.id === user?.id;

  const isAdministrator =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const canEdit = isOwner || isAdministrator;

  const conditionLabel = publication.condition
    ? publication.condition.replaceAll("_", " ")
    : "No especificado";

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

  const handleContactSeller = () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/publications/${publication.id}`,
          cancelTo: `/publications/${publication.id}`,
        },
      });
      return;
    }

    if (isOwner) {
      return;
    }

    alert("La mensajería entre usuarios se implementará próximamente.");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareSuccess(true);

      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("No se pudo copiar el enlace:", err);
    }
  };

  const handleCreateComment = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/publications/${publication.id}`,
          cancelTo: `/publications/${publication.id}`,
        },
      });
      return;
    }

    const content = commentText.trim();

    if (!content) {
      setCommentError("Escribe un comentario.");
      return;
    }

    try {
      setCommentSaving(true);
      setCommentError("");

      const created = await createComment({
        content,
        user: { id: user.id },
        publication: { id: publication.id },
      });

      setComments((prev) => [...prev, created]);
      setCommentText("");
    } catch (err) {
      console.error(err);
      setCommentError("No se pudo publicar el comentario.");
    } finally {
      setCommentSaving(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) {
      return;
    }

    try {
      await deleteComment(commentToDelete.id);

      setComments((prev) =>
        prev.filter((item) => item.id !== commentToDelete.id)
      );

      setCommentToDelete(null);
    } catch (err) {
      console.error(err);
      setCommentError("No se pudo eliminar el comentario.");
    }
  };

  return (
    <div className="flex-1 max-w-[1250px] mx-auto w-full px-5 py-8">
      <div
        className="flex items-center gap-2 text-[12px] mb-7 flex-wrap"
        style={{ color: "#6f7890" }}
      >
        <button onClick={() => navigate("/")} className="hover:text-white">
          Inicio
        </button>

        <span>›</span>

        <button
          onClick={() => navigate("/explore")}
          className="hover:text-white"
        >
          Explorar
        </button>

        <span>›</span>

        <span style={{ color: "#c4c8d8" }}>
          {publication.albumName || publication.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)_280px] gap-7">
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
                    background: "rgba(15,17,23,0.85)",
                    color: "#e8eaf0",
                  }}
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(15,17,23,0.85)",
                    color: "#e8eaf0",
                  }}
                >
                  <ChevronRight size={17} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
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
          )}

          <button
            onClick={() => navigate("/explore")}
            className="flex items-center gap-1 mt-5 text-[12px]"
            style={{ color: "#8892a4" }}
          >
            <ArrowLeft size={13} />
            Volver a resultados
          </button>
        </section>

        <main className="min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: "#e8eaf0" }}
              >
                {publication.albumName || publication.name}
              </h1>

              <p className="text-[16px]" style={{ color: "#8892a4" }}>
                {publication.artist || "Artista no especificado"}
              </p>
            </div>

            {canEdit && (
              <button
                onClick={() =>
                  navigate(`/publications/${publication.id}/edit`)
                }
                className="shrink-0 flex items-center gap-2 px-3 py-2 rounded text-[12px] font-semibold"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Edit3 size={14} />
                Editar
              </button>
            )}
          </div>

          <p
            className="text-3xl font-bold mt-6 mb-3"
            style={{ color: "#f59e0b" }}
          >
            USD {Number(publication.price).toFixed(2)}
          </p>

          <div className="flex flex-wrap gap-2 mb-7">
            {publication.format && (
              <DetailChip
                icon={<Disc3 size={13} />}
                text={publication.format}
              />
            )}

            {publication.genre && (
              <DetailChip
                icon={<Music2 size={13} />}
                text={publication.genre}
              />
            )}

            <DetailChip
              icon={<Tag size={13} />}
              text={conditionLabel}
            />

            {publication.releaseYear && (
              <DetailChip
                icon={<Calendar size={13} />}
                text={publication.releaseYear.toString()}
              />
            )}
          </div>

          <section className="mb-7">
            <h2 className="text-[14px] font-semibold mb-3">
              Descripción
            </h2>

            <p
              className="text-[14px] leading-7 whitespace-pre-line"
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

          {!isOwner && (
            <button
              onClick={handleContactSeller}
              className="w-full max-w-[340px] py-3 rounded text-[13px] font-semibold flex items-center justify-center gap-2"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              <MessageCircle size={16} />
              Contactar vendedor
            </button>
          )}

          <section
            className="mt-10 pt-7"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-2">
                <MessageCircle
                  size={18}
                  style={{ color: "#f59e0b" }}
                />

                <h2 className="text-[15px] font-semibold">
                  Comentarios
                </h2>

                <span
                  className="text-[11px] px-2 py-0.5 rounded-full"
                  style={{
                    background: "#1e2433",
                    color: "#8892a4",
                  }}
                >
                  {comments.length}
                </span>
              </div>
            </div>

            {user ? (
              <div
                className="rounded-lg p-4 mb-5"
                style={{
                  background: "#161b27",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-3">
                  <div
                    className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                    style={{ background: "#232a3a" }}
                  >
                    <User
                      size={15}
                      style={{ color: "#8892a4" }}
                    />
                  </div>

                  <div className="flex-1">
                    <p
                      className="text-[12px] font-semibold mb-2"
                      style={{ color: "#c4c8d8" }}
                    >
                      {user.name}
                    </p>

                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      maxLength={500}
                      placeholder="Escribe un comentario..."
                      className="w-full min-h-[90px] resize-none rounded p-3 text-[13px] outline-none"
                      style={{
                        background: "#1e2433",
                        color: "#e8eaf0",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />

                    <div className="flex items-center justify-between gap-3 mt-3">
                      <span
                        className="text-[10px]"
                        style={{ color: "#6f7890" }}
                      >
                        {commentText.length}/500
                      </span>

                      <button
                        type="button"
                        disabled={
                          commentSaving ||
                          !commentText.trim()
                        }
                        onClick={handleCreateComment}
                        className="px-4 py-2 rounded text-[12px] font-semibold flex items-center gap-2 disabled:opacity-50"
                        style={{
                          background: "#f59e0b",
                          color: "#0f1117",
                        }}
                      >
                        <Send size={13} />
                        {commentSaving
                          ? "Publicando..."
                          : "Publicar"}
                      </button>
                    </div>

                    {commentError && (
                      <p
                        className="text-[11px] mt-3"
                        style={{ color: "#ef4444" }}
                      >
                        {commentError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-lg p-4 mb-5 text-center"
                style={{
                  background: "#161b27",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-[12px] mb-3"
                  style={{ color: "#8892a4" }}
                >
                  Inicia sesión para dejar un comentario.
                </p>

                <button
                  onClick={() =>
                    navigate("/login", {
                      state: {
                        from: `/publications/${publication.id}`,
                        cancelTo: `/publications/${publication.id}`,
                      },
                    })
                  }
                  className="px-4 py-2 rounded text-[12px] font-semibold"
                  style={{
                    background: "#f59e0b",
                    color: "#0f1117",
                  }}
                >
                  Iniciar sesión
                </button>
              </div>
            )}

            {commentsLoading ? (
              <p
                className="text-[12px]"
                style={{ color: "#8892a4" }}
              >
                Cargando comentarios...
              </p>
            ) : comments.length === 0 ? (
              <div
                className="rounded-lg p-6 text-center"
                style={{
                  background: "#161b27",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-[13px]"
                  style={{ color: "#8892a4" }}
                >
                  Todavía no hay comentarios. Sé el primero en comentar.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const canDeleteComment =
                    comment.user.id === user?.id ||
                    isAdministrator;

                  return (
                    <div
                      key={comment.id}
                      className="rounded-lg p-4"
                      style={{
                        background: "#161b27",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center"
                          style={{ background: "#232a3a" }}
                        >
                          <User
                            size={15}
                            style={{ color: "#8892a4" }}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p
                                className="text-[12px] font-semibold"
                                style={{ color: "#e8eaf0" }}
                              >
                                {comment.user.name}
                              </p>

                              <p
                                className="text-[10px] mt-0.5"
                                style={{ color: "#6f7890" }}
                              >
                                {comment.createdAt}
                              </p>
                            </div>

                            {canDeleteComment && (
                              <button
                                onClick={() =>
                                  setCommentToDelete(comment)
                                }
                                className="p-1.5 rounded hover:opacity-80"
                                style={{ color: "#ef4444" }}
                                title="Eliminar comentario"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          <p
                            className="text-[13px] leading-6 mt-3 whitespace-pre-line break-words"
                            style={{ color: "#a2aabd" }}
                          >
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

        <aside
          className="rounded-lg p-5 h-fit lg:sticky lg:top-5"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <SidebarSection
            number="1"
            title="Vendedor"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#232a3a" }}
              >
                <User
                  size={17}
                  style={{ color: "#8892a4" }}
                />
              </div>

              <div>
                <p
                  className="text-[13px] font-semibold"
                  style={{ color: "#e8eaf0" }}
                >
                  {publication.user?.name ||
                    "Usuario no disponible"}
                </p>

                <p
                  className="text-[11px]"
                  style={{ color: "#6f7890" }}
                >
                  Vendedor
                </p>
              </div>
              {publication.user && (
                <button
                  onClick={() =>
                    navigate(
                      `/users/${publication.user!.id}`
                    )
                  }
                  className="mt-3 text-[12px] font-semibold"
                  style={{
                    color: "#f59e0b",
                  }}
                >
                  Ver perfil →
                </button>
              )}
            </div>
          </SidebarSection>

          <SidebarSection
            number="2"
            title="Información"
          >
            <InfoRow
              label="Formato"
              value={
                publication.format ||
                "No especificado"
              }
            />

            <InfoRow
              label="Estado"
              value={conditionLabel}
            />

            <InfoRow
              label="Año"
              value={
                publication.releaseYear?.toString() ||
                "No especificado"
              }
            />

            <InfoRow
              label="Género"
              value={
                publication.genre ||
                "No especificado"
              }
            />
          </SidebarSection>

          <SidebarSection
            number="3"
            title="Acciones"
          >
            {!isOwner && (
              <button
                onClick={handleContactSeller}
                className="w-full py-2.5 rounded text-[12px] font-semibold flex items-center justify-center gap-2"
                style={{
                  background: "#f59e0b",
                  color: "#0f1117",
                }}
              >
                <MessageCircle size={14} />
                Contactar vendedor
              </button>
            )}

            <button
              onClick={() =>
                setFavorite((prev) => !prev)
              }
              className="w-full py-2.5 rounded mt-2 text-[12px] flex items-center justify-center gap-2"
              style={{
                background: "#1e2433",
                color: favorite
                  ? "#f59e0b"
                  : "#c4c8d8",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Heart
                size={14}
                fill={
                  favorite
                    ? "currentColor"
                    : "none"
                }
              />

              {favorite
                ? "En favoritos"
                : "Agregar a favoritos"}
            </button>

            <button
              onClick={handleShare}
              className="w-full py-2 mt-2 text-[12px] flex items-center justify-center gap-2"
              style={{ color: "#8892a4" }}
            >
              <Share2 size={14} />
              {shareSuccess
                ? "Enlace copiado"
                : "Compartir"}
            </button>

            {canEdit && (
              <button
                onClick={() =>
                  navigate(
                    `/publications/${publication.id}/edit`
                  )
                }
                className="w-full py-2.5 rounded mt-3 text-[12px] flex items-center justify-center gap-2"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Edit3 size={13} />
                Editar publicación
              </button>
            )}

            {isAdministrator &&
              !isOwner && (
                <div
                  className="flex items-center gap-2 text-[10px] mt-3"
                  style={{ color: "#f59e0b" }}
                >
                  <ShieldCheck size={12} />
                  Vista administrativa
                </div>
              )}
          </SidebarSection>
        </aside>
      </div>

      <AlertDialog
        open={commentToDelete !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCommentToDelete(null);
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
              ¿Eliminar comentario?
            </AlertDialogTitle>

            <AlertDialogDescription
              style={{ color: "#8892a4" }}
            >
              Esta acción no se puede deshacer.
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
              onClick={handleDeleteComment}
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

function DetailChip({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full"
      style={{
        background: "#1e2433",
        color: "#c4c8d8",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {icon}
      {text}
    </span>
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
      <span style={{ color: "#6f7890" }}>
        {label}
      </span>

      <span
        className="text-right"
        style={{ color: "#c4c8d8" }}
      >
        {value}
      </span>
    </div>
  );
}
