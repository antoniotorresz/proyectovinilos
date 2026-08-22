import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import type { Publication } from "../types/Publication";
import {
  getPublicationById,
  updatePublication,
} from "../services/publicationService";

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!publication) return;

    const { name, value } = e.target;

    setPublication({
      ...publication,
      [name]:
        name === "price"
          ? Number(value)
          : name === "releaseYear"
          ? Number(value)
          : value,
    });
  };

  const handleImageChange = (value: string) => {
    if (!publication) return;

    setPublication({
      ...publication,
      imageUris: value ? [value] : [],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!publication) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updatePublication(publication.id, publication);

      setPublication(updated);
      setSuccess("Publicación actualizada correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la publicación.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#8892a4" }}>Cargando publicación...</p>
      </div>
    );
  }

  if (error && !publication) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#ef4444" }}>{error}</p>
      </div>
    );
  }

  if (!publication) return null;

  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
  };

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Editar publicación</h1>

        <p style={{ color: "#8892a4" }}>
          Modifica la información de tu publicación.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg p-6"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-[13px] mb-2">Título</label>
            <input
              name="name"
              value={publication.name || ""}
              onChange={handleChange}
              required
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">Álbum</label>
            <input
              name="albumName"
              value={publication.albumName || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">Artista</label>
            <input
              name="artist"
              value={publication.artist || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">Género</label>
            <input
              name="genre"
              value={publication.genre || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Año de lanzamiento
            </label>

            <input
              type="number"
              name="releaseYear"
              value={publication.releaseYear || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">Precio</label>

            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={publication.price}
              onChange={handleChange}
              required
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">Formato</label>

            <select
              name="format"
              value={publication.format || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            >
              <option value="">Seleccionar formato</option>
              <option value="Vinilo">Vinilo</option>
              <option value="CD">CD</option>
              <option value="Cassette">Cassette</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] mb-2">Estado</label>

            <select
              name="condition"
              value={publication.condition || ""}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            >
              <option value="">Seleccionar estado</option>
              <option value="MINT">Mint</option>
              <option value="NEAR_MINT">Near Mint</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="VERY_GOOD">Very Good</option>
              <option value="GOOD">Good</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] mb-2">
              URL de imagen
            </label>

            <input
              value={publication.imageUris?.[0] || ""}
              onChange={(e) => handleImageChange(e.target.value)}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[13px] mb-2">
              Descripción
            </label>

            <textarea
              name="description"
              value={publication.description || ""}
              onChange={handleChange}
              rows={5}
              className="w-full rounded px-3 py-2 outline-none resize-y"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <p className="mt-5 text-[13px]" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}

        {success && (
          <p className="mt-5 text-[13px]" style={{ color: "#22c55e" }}>
            {success}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/my-publications")}
            className="px-5 py-2 rounded text-[13px] font-semibold"
            style={{
              background: "#1e2433",
              color: "#c4c8d8",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded text-[13px] font-semibold disabled:opacity-50"
            style={{
              background: "#f59e0b",
              color: "#0f1117",
            }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}