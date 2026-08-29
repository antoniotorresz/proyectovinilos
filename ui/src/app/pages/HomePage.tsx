import { useEffect, useState } from "react";
import {
  ArrowRight,
  Disc3,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

import PublicationCard from "../components/publications/PublicationCard";
import { getPublications } from "../services/publicationService";
import type { Publication } from "../types/Publication";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [publications, setPublications] =
    useState<Publication[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadPublications = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getPublications();

        const recent = [...data]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          )
          .slice(0, 3);

        setPublications(recent);
      } catch (err) {
        console.error(err);

        setError(
          "No se pudieron cargar las publicaciones recientes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  const handlePublish = () => {
    navigate("/publish", {
      state: {
        previousPublicPage: "/",
      },
    });
  };

  return (
    <div className="flex-1">
      <section
        style={{
          background:
            "linear-gradient(135deg, #161b27 0%, #111722 55%, #0f1117 100%)",
          borderBottom:
            "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 py-20">
          <div className="max-w-[720px]">
            <div
              className="inline-flex items-center gap-2 text-[12px] font-semibold px-3 py-1.5 rounded-full mb-5"
              style={{
                background:
                  "rgba(245,158,11,0.1)",
                color:
                  "#f59e0b",
                border:
                  "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <Disc3 size={14} />
              Marketplace para amantes de la música
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold leading-tight mb-5"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Encuentra música.
              <br />
              Comparte tu colección.
            </h1>

            <p
              className="text-[16px] leading-7 mb-8 max-w-[600px]"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Compra y vende vinilos, CDs y cassettes dentro de una comunidad
              dedicada a coleccionistas y aficionados de la música.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  navigate(
                    "/explore"
                  )
                }
                className="flex items-center gap-2 px-6 py-3 rounded text-[13px] font-semibold transition-opacity hover:opacity-90"
                style={{
                  background:
                    "#f59e0b",
                  color:
                    "#0f1117",
                }}
              >
                Explorar publicaciones
                <ArrowRight
                  size={15}
                />
              </button>

              <button
                onClick={
                  handlePublish
                }
                className="flex items-center gap-2 px-6 py-3 rounded text-[13px] font-semibold transition-opacity hover:opacity-80"
                style={{
                  background:
                    "#1e2433",
                  color:
                    "#c4c8d8",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Plus
                  size={15}
                />

                {user
                  ? "Publicar producto"
                  : "Comenzar a publicar"}
              </button>
            </div>

            <div className="flex flex-wrap gap-5 mt-8">
              <HeroFeature
                icon={
                  <Search
                    size={14}
                  />
                }
                text="Búsqueda y filtros"
              />

              <HeroFeature
                icon={
                  <Disc3
                    size={14}
                  />
                }
                text="Vinilo, CD y cassette"
              />

              <HeroFeature
                icon={
                  <ShieldCheck
                    size={14}
                  />
                }
                text="Perfiles y administración"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto w-full px-5 py-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2
              className="text-xl font-bold mb-1"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Publicaciones recientes
            </h2>

            <p
              className="text-[13px]"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Descubre algunos de los productos publicados recientemente.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/explore"
              )
            }
            className="text-[13px] font-semibold flex items-center gap-1 hover:opacity-80"
            style={{
              color:
                "#f59e0b",
            }}
          >
            Ver todas
            <ArrowRight
              size={14}
            />
          </button>
        </div>

        {loading ? (
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
              Cargando publicaciones...
            </p>
          </div>
        ) : error ? (
          <div
            className="rounded-lg p-6"
            style={{
              background:
                "#161b27",
              border:
                "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <p
              className="text-[13px]"
              style={{
                color:
                  "#ef4444",
              }}
            >
              {error}
            </p>
          </div>
        ) : publications.length ===
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
            <Disc3
              size={28}
              className="mx-auto mb-3"
              style={{
                color:
                  "#6f7890",
              }}
            />

            <h3
              className="text-[15px] font-semibold mb-2"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Todavía no hay publicaciones
            </h3>

            <p
              className="text-[13px] mb-5"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Sé el primero en publicar un producto en Music Market.
            </p>

            <button
              onClick={
                handlePublish
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded text-[13px] font-semibold"
              style={{
                background:
                  "#f59e0b",
                color:
                  "#0f1117",
              }}
            >
              <Plus
                size={15}
              />
              Crear publicación
            </button>
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

function HeroFeature({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div
      className="flex items-center gap-2 text-[11px]"
      style={{
        color:
          "#6f7890",
      }}
    >
      <span
        style={{
          color:
            "#f59e0b",
        }}
      >
        {icon}
      </span>

      {text}
    </div>
  );
}
