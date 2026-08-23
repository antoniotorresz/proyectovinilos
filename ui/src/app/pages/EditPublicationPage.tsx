import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import type { Publication } from "../types/Publication";
import {
  getPublicationById,
  updatePublication,
} from "../services/publicationService";
import PublicationForm from "../components/publications/PublicationForm";
import type { PublicationFormData } from "../components/publications/PublicationForm";

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [publication, setPublication] = useState<Publication | null>(null);
  const [form, setForm] = useState<PublicationFormData | null>(null);

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

        setForm({
          name: data.name || "",
          albumName: data.albumName || "",
          artist: data.artist || "",
          genre: data.genre || "",
          releaseYear: data.releaseYear?.toString() || "",
          condition: data.condition || "",
          format: data.format || "",
          price: data.price?.toString() || "",
          description: data.description || "",
          imageUrl: data.imageUris?.[0] || "",
        });
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
    const { name, value } = e.target;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!publication || !form) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedPublication: Publication = {
        ...publication,
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
      };

      const updated = await updatePublication(
        publication.id,
        updatedPublication
      );

      setPublication(updated);

      setForm({
        name: updated.name || "",
        albumName: updated.albumName || "",
        artist: updated.artist || "",
        genre: updated.genre || "",
        releaseYear: updated.releaseYear?.toString() || "",
        condition: updated.condition || "",
        format: updated.format || "",
        price: updated.price?.toString() || "",
        description: updated.description || "",
        imageUrl: updated.imageUris?.[0] || "",
      });

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
        <p style={{ color: "#8892a4" }}>
          Cargando publicación...
        </p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#ef4444" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Editar publicación
        </h1>

        <p style={{ color: "#8892a4" }}>
          Modifica la información de tu publicación.
        </p>
      </div>

      <PublicationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/my-publications")}
        saving={saving}
        error={error}
        success={success}
        submitText="Guardar cambios"
        savingText="Guardando..."
      />
    </div>
  );
}