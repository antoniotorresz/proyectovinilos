import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ImageOff } from "lucide-react";

export interface PublicationFormData {
  name: string;
  albumName: string;
  artist: string;
  genre: string;
  releaseYear: string;
  condition: string;
  format: string;
  price: string;
  description: string;
  imageUrl: string;
}

interface PublicationFormProps {
  form: PublicationFormData;
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  saving?: boolean;
  error?: string;
  success?: string;
  submitText?: string;
  savingText?: string;
}

export default function PublicationForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  saving = false,
  error = "",
  success = "",
  submitText = "Guardar",
  savingText = "Guardando...",
}: PublicationFormProps) {
  const [imageError, setImageError] = useState(false);

  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
  };

  const descriptionLength = form.description.length;

  const handleImageUrlChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setImageError(false);
    onChange(e);
  };

  return (
    <form
      onSubmit={onSubmit}
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
            onChange={onChange}
            required
            maxLength={150}
            placeholder="Ej. Random Access Memories"
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
            onChange={onChange}
            maxLength={150}
            placeholder="Nombre del álbum"
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
            onChange={onChange}
            maxLength={150}
            placeholder="Nombre del artista"
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
            onChange={onChange}
            maxLength={100}
            placeholder="Ej. Rock, Electronic, Jazz"
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
            onChange={onChange}
            min="1900"
            max="2100"
            placeholder="Ej. 2013"
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">
            Precio (USD) *
          </label>

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
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
            onChange={onChange}
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
            onChange={onChange}
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
            onChange={handleImageUrlChange}
            placeholder="https://..."
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />

          {form.imageUrl && (
            <div
              className="mt-4 rounded-lg overflow-hidden flex items-center justify-center"
              style={{
                background: "#111722",
                border: "1px solid rgba(255,255,255,0.07)",
                minHeight: 220,
              }}
            >
              {!imageError ? (
                <img
                  src={form.imageUrl}
                  alt="Vista previa de la publicación"
                  className="max-h-[320px] w-full object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div
                  className="flex flex-col items-center gap-2 py-10"
                  style={{ color: "#8892a4" }}
                >
                  <ImageOff size={28} />
                  <p className="text-[12px]">
                    No se pudo cargar la imagen.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between gap-4 mb-2">
            <label className="block text-[13px]">
              Descripción
            </label>

            <span
              className="text-[11px]"
              style={{
                color:
                  descriptionLength > 900
                    ? "#f59e0b"
                    : "#6f7890",
              }}
            >
              {descriptionLength}/1000
            </span>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={5}
            maxLength={1000}
            placeholder="Describe el producto, edición, detalles y condición."
            className="w-full rounded px-3 py-2 outline-none resize-y"
            style={inputStyle}
          />
        </div>
      </div>

      {error && (
        <div
          className="mt-5 rounded px-3 py-2 text-[13px]"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="mt-5 rounded px-3 py-2 text-[13px]"
          style={{
            background: "rgba(34,197,94,0.08)",
            color: "#22c55e",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          {success}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-5 py-2 rounded text-[13px] font-semibold disabled:opacity-50"
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
          {saving ? savingText : submitText}
        </button>
      </div>
    </form>
  );
}
