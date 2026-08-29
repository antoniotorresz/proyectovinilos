import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router";
import { Disc3 } from "lucide-react";

import { createPublication } from "../services/publicationService";
import PublicationForm from "../components/publications/PublicationForm";
import type { PublicationFormData } from "../components/publications/PublicationForm";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [form, setForm] =
    useState<PublicationFormData>(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      return "El título es obligatorio.";
    }

    if (!form.format) {
      return "Selecciona un formato.";
    }

    if (!form.condition) {
      return "Selecciona el estado del producto.";
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      return "El precio debe ser mayor que 0.";
    }

    if (form.releaseYear) {
      const year = Number(form.releaseYear);

      if (
        !Number.isInteger(year) ||
        year < 1900 ||
        year > 2100
      ) {
        return "El año de lanzamiento debe estar entre 1900 y 2100.";
      }
    }

    return "";
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!user) {
      setError(
        "Debes iniciar sesión para crear una publicación."
      );
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const created =
        await createPublication({
          name: form.name.trim(),
          albumName:
            form.albumName.trim(),
          artist:
            form.artist.trim(),
          genre:
            form.genre.trim(),
          releaseYear:
            form.releaseYear
              ? Number(
                  form.releaseYear
                )
              : undefined,
          condition:
            form.condition,
          format:
            form.format,
          price: Number(
            form.price
          ),
          description:
            form.description.trim(),
          imageUris:
            form.imageUrl.trim()
              ? [
                  form.imageUrl.trim(),
                ]
              : [],
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt:
              user.createdAt,
          },
        });

      navigate(
        `/publications/${created.id}`,
        {
          replace: true,
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo crear la publicación."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Disc3
            size={25}
            style={{
              color: "#f59e0b",
            }}
          />

          <h1
            className="text-2xl font-bold"
            style={{
              color: "#e8eaf0",
            }}
          >
            Crear publicación
          </h1>
        </div>

        <p
          className="text-[13px]"
          style={{
            color: "#8892a4",
          }}
        >
          Publica un vinilo, CD o cassette en Music Market.
        </p>
      </div>

      <PublicationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(
            "/my-publications"
          )
        }
        saving={saving}
        error={error}
        submitText="Publicar"
        savingText="Publicando..."
      />
    </div>
  );
}
