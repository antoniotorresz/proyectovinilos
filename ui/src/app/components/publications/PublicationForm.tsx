import type { ChangeEvent, FormEvent } from "react";

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
  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
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
          <label className="block text-[13px] mb-2">Título *</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">Álbum</label>
          <input
            name="albumName"
            value={form.albumName}
            onChange={onChange}
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">Artista</label>
          <input
            name="artist"
            value={form.artist}
            onChange={onChange}
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">Género</label>
          <input
            name="genre"
            value={form.genre}
            onChange={onChange}
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
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">Precio *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            step="0.01"
            min="0"
            required
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-[13px] mb-2">Formato *</label>
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
          <label className="block text-[13px] mb-2">Estado *</label>
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
          <label className="block text-[13px] mb-2">URL de imagen</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            placeholder="https://..."
            className="w-full rounded px-3 py-2 outline-none"
            style={inputStyle}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-[13px] mb-2">Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
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
          onClick={onCancel}
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
          {saving ? savingText : submitText}
        </button>
      </div>
    </form>
  );
}