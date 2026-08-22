import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import { createPublication } from "../services/publicationService";

export default function PublishPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    albumName: "",
    artist: "",
    genre: "",
    releaseYear: "",
    condition: "",
    format: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createPublication({
        name: form.name,
        albumName: form.albumName,
        artist: form.artist,
        genre: form.genre,
        releaseYear: form.releaseYear
          ? Number(form.releaseYear)
          : undefined,
        condition: form.condition,
        format: form.format,
        price: Number(form.price),
        description: form.description,
        imageUris: form.imageUrl ? [form.imageUrl] : [],
        user: {
          id: 1,
          name: "",
          email: "",
          createdAt: "",
        },
      });

      navigate("/my-publications");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la publicación.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
  };

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Crear publicación
        </h1>

        <p style={{ color: "#8892a4" }}>
          Publica un vinilo, CD o cassette en Music Market.
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
            <label className="block text-[13px] mb-2">
              Título *
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Álbum
            </label>

            <input
              name="albumName"
              value={form.albumName}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Artista
            </label>

            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Género
            </label>

            <input
              name="genre"
              value={form.genre}
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
              value={form.releaseYear}
              onChange={handleChange}
              min="1900"
              max="2100"
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Precio *
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full rounded px-3 py-2 outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-[13px] mb-2">
              Formato *
            </label>

            <select
              name="format"
              value={form.format}
              onChange={handleChange}
              required
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
            <label className="block text-[13px] mb-2">
              Estado *
            </label>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              required
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
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
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
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded px-3 py-2 outline-none resize-y"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <p
            className="mt-5 text-[13px]"
            style={{ color: "#ef4444" }}
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate("/explore")}
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
            {saving ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}