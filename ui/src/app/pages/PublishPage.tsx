import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import { createPublication } from "../services/publicationService";
import PublicationForm from "../components/publications/PublicationForm";
import type { PublicationFormData } from "../components/publications/PublicationForm";

const initialForm: PublicationFormData = {
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
};

export default function PublishPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PublicationFormData>(initialForm);
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

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Crear publicación</h1>

        <p style={{ color: "#8892a4" }}>
          Publica un vinilo, CD o cassette en Music Market.
        </p>
      </div>

      <PublicationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/explore")}
        saving={saving}
        error={error}
        submitText="Publicar"
        savingText="Publicando..."
      />
    </div>
  );
}