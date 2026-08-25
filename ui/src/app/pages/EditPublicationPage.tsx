import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { Edit3 } from "lucide-react";

import type { Publication } from "../types/Publication";

import {
  getPublicationById,
  updatePublication,
} from "../services/publicationService";

import PublicationForm from "../components/publications/PublicationForm";
import type { PublicationFormData } from "../components/publications/PublicationForm";

import { useAuth } from "../context/AuthContext";

export default function EditPublicationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [publication, setPublication] =
    useState<Publication | null>(null);

  const [form, setForm] =
    useState<PublicationFormData | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const loadPublication =
      async () => {
        if (!id) {
          setError(
            "No se encontró el ID de la publicación."
          );
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError("");

          const data =
            await getPublicationById(
              Number(id)
            );

          const isOwner =
            data.user?.id ===
            user?.id;

          const isAdministrator =
            user?.role ===
              "ADMIN" ||
            user?.role ===
              "SUPER_ADMIN";

          if (
            !isOwner &&
            !isAdministrator
          ) {
            setError(
              "No tienes permiso para editar esta publicación."
            );
            setLoading(false);
            return;
          }

          setPublication(data);

          setForm({
            name: data.name || "",
            albumName:
              data.albumName || "",
            artist:
              data.artist || "",
            genre:
              data.genre || "",
            releaseYear:
              data.releaseYear?.toString() ||
              "",
            condition:
              data.condition || "",
            format:
              data.format || "",
            price:
              data.price?.toString() ||
              "",
            description:
              data.description || "",
            imageUrl:
              data.imageUris?.[0] ||
              "",
          });
        } catch (err) {
          console.error(err);

          setError(
            "No se pudo cargar la publicación."
          );
        } finally {
          setLoading(false);
        }
      };

    loadPublication();
  }, [id, user]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      e.target;

    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : prev
    );

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const validateForm = () => {
    if (!form) {
      return "No hay información de la publicación.";
    }

    if (!form.name.trim()) {
      return "El título es obligatorio.";
    }

    if (!form.format) {
      return "Selecciona un formato.";
    }

    if (!form.condition) {
      return "Selecciona el estado del producto.";
    }

    const price =
      Number(form.price);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return "El precio debe ser mayor que 0.";
    }

    if (form.releaseYear) {
      const year =
        Number(
          form.releaseYear
        );

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

    if (
      !publication ||
      !form
    ) {
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedPublication: Publication =
        {
          ...publication,
          name:
            form.name.trim(),
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
          price:
            Number(
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
        };

      const updated =
        await updatePublication(
          publication.id,
          updatedPublication
        );

      setPublication(
        updated
      );

      setForm({
        name: updated.name || "",
        albumName:
          updated.albumName || "",
        artist:
          updated.artist || "",
        genre:
          updated.genre || "",
        releaseYear:
          updated.releaseYear?.toString() ||
          "",
        condition:
          updated.condition || "",
        format:
          updated.format || "",
        price:
          updated.price?.toString() ||
          "",
        description:
          updated.description || "",
        imageUrl:
          updated.imageUris?.[0] ||
          "",
      });

      setSuccess(
        "Publicación actualizada correctamente."
      );

      window.setTimeout(() => {
        navigate(
          `/publications/${updated.id}`,
          {
            replace: true,
          }
        );
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        "No se pudo actualizar la publicación."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
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
              color:
                "#8892a4",
            }}
          >
            Cargando publicación...
          </p>
        </div>
      </div>
    );
  }

  if (
    error &&
    !form
  ) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <div
          className="rounded-lg p-10 text-center"
          style={{
            background:
              "#161b27",

            border:
              "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p
            className="mb-5"
            style={{
              color:
                "#ef4444",
            }}
          >
            {error}
          </p>

          <button
            onClick={() =>
              navigate(
                "/explore"
              )
            }
            className="px-5 py-2.5 rounded text-[13px] font-semibold"
            style={{
              background:
                "#f59e0b",

              color:
                "#0f1117",
            }}
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Edit3
            size={24}
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
            Editar publicación
          </h1>
        </div>

        <p
          className="text-[13px]"
          style={{
            color:
              "#8892a4",
          }}
        >
          Modifica la información de la publicación.
        </p>
      </div>

      <PublicationForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(
            `/publications/${publication?.id}`
          )
        }
        saving={saving}
        error={error}
        success={success}
        submitText="Guardar cambios"
        savingText="Guardando..."
      />
    </div>
  );
}
