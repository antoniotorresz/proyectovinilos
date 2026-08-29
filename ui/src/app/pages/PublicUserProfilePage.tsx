import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Disc3,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getUserById,
} from "../services/userService";

import type {
  User as UserType,
} from "../services/userService";

import {
  getPublicationsByUser,
} from "../services/publicationService";

import type {
  Publication,
} from "../types/Publication";

import PublicationCard from "../components/publications/PublicationCard";

export default function PublicUserProfilePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<UserType | null>(null);

  const [publications, setPublications] =
    useState<Publication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) {
        setError(
          "No se encontró el usuario."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const userId =
          Number(id);

        const [
          userData,
          publicationData,
        ] = await Promise.all([
          getUserById(userId),
          getPublicationsByUser(
            userId
          ),
        ]);

        setProfile(userData);

        setPublications(
          publicationData
        );
      } catch (err) {
        console.error(err);

        setError(
          "No se pudo cargar el perfil del vendedor."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

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
              color:
                "#8892a4",
            }}
          >
            Cargando perfil...
          </p>
        </div>

      </div>
    );
  }

  if (
    error ||
    !profile
  ) {
    return (
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-10">

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
            {error ||
              "Usuario no encontrado."}
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

  const roleLabel =
    profile.role ===
    "SUPER_ADMIN"
      ? "SUPER ADMIN"
      : profile.role;

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-8">

      <button
        onClick={() =>
          navigate(-1)
        }
        className="flex items-center gap-1 text-[12px] mb-6 hover:text-white"
        style={{
          color:
            "#8892a4",
        }}
      >
        <ArrowLeft
          size={13}
        />

        Regresar
      </button>

      <section
        className="rounded-lg overflow-hidden mb-8"
        style={{
          background:
            "#161b27",

          border:
            "1px solid rgba(255,255,255,0.07)",
        }}
      >

        <div className="p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div className="flex items-center gap-5">

            <div
              className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center"
              style={{
                background:
                  "#232a3a",

                color:
                  "#f59e0b",
              }}
            >
              <User
                size={34}
              />
            </div>

            <div>

              <h1
                className="text-2xl font-bold mb-1"
                style={{
                  color:
                    "#e8eaf0",
                }}
              >
                {profile.name}
              </h1>

              <p
                className="text-[13px]"
                style={{
                  color:
                    "#8892a4",
                }}
              >
                Vendedor de Music Market
              </p>

              <div className="flex flex-wrap gap-2 mt-3">

                <span
                  className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full"
                  style={{
                    background:
                      "#1e2433",

                    color:
                      "#c4c8d8",

                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Calendar
                    size={12}
                  />

                  Miembro desde{" "}
                  {profile.createdAt}
                </span>

                {(profile.role ===
                  "ADMIN" ||
                  profile.role ===
                    "SUPER_ADMIN") && (
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full"
                    style={{
                      background:
                        "rgba(245,158,11,0.1)",

                      color:
                        "#f59e0b",

                      border:
                        "1px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    <ShieldCheck
                      size={12}
                    />

                    {roleLabel}
                  </span>
                )}

              </div>

            </div>

          </div>

          <div
            className="flex items-center gap-3 px-5 py-4 rounded-lg"
            style={{
              background:
                "#1e2433",

              border:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Disc3
              size={24}
              style={{
                color:
                  "#f59e0b",
              }}
            />

            <div>
              <p
                className="text-xl font-bold"
                style={{
                  color:
                    "#e8eaf0",
                }}
              >
                {publications.length}
              </p>

              <p
                className="text-[11px]"
                style={{
                  color:
                    "#8892a4",
                }}
              >
                Publicaciones
              </p>
            </div>

          </div>

        </div>

      </section>

      <section>

        <div className="mb-5">

          <h2
            className="text-lg font-bold mb-1"
            style={{
              color:
                "#e8eaf0",
            }}
          >
            Publicaciones del vendedor
          </h2>

          <p
            className="text-[12px]"
            style={{
              color:
                "#8892a4",
            }}
          >
            Productos publicados por{" "}
            {profile.name}.
          </p>

        </div>

        {publications.length ===
        0 ? (
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
              Este usuario todavía no tiene publicaciones.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {publications.map(
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
                />
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}