import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import PublicationCard from "../components/publications/PublicationCard";

import type { Publication } from "../types/Publication";

import {
  filterPublications,
  getPublications,
} from "../services/publicationService";

export default function ExplorePage() {
  const [search, setSearch] =
    useState("");

  const [
    formatoChecked,
    setFormatoChecked,
  ] = useState<string[]>([]);

  const [condition, setCondition] =
    useState("");

  const [precioMin, setPrecioMin] =
    useState("");

  const [precioMax, setPrecioMax] =
    useState("");

  const [
    generoActivo,
    setGeneroActivo,
  ] = useState("Todos");

  const [ordenar, setOrdenar] =
    useState("Más recientes");

  const [
    publicaciones,
    setPublicaciones,
  ] = useState<Publication[]>([]);

  const [generos, setGeneros] =
    useState<string[]>(["Todos"]);

  const [filterError, setFilterError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [backendError, setBackendError] =
    useState("");

  useEffect(() => {
    const cargarPublicaciones =
      async () => {
        try {
          setLoading(true);
          setBackendError("");

          const data =
            await getPublications();

          setPublicaciones(data);

          const generosUnicos =
            Array.from(
              new Set(
                data
                  .map(
                    (
                      publication
                    ) =>
                      publication.genre
                  )
                  .filter(
                    (
                      genre
                    ): genre is string =>
                      Boolean(
                        genre
                      )
                  )
              )
            ).sort();

          setGeneros([
            "Todos",
            ...generosUnicos,
          ]);
        } catch (error) {
          console.error(
            "Error al cargar publicaciones:",
            error
          );

          setBackendError(
            "No se pudieron cargar las publicaciones."
          );
        } finally {
          setLoading(false);
        }
      };

    cargarPublicaciones();
  }, []);

  const toggleFormato = (
    format: string
  ) => {
    setFormatoChecked(
      (prev) =>
        prev.includes(
          format
        )
          ? []
          : [format]
    );
  };

  const applyFilters = async (
    genreOverride?: string,
    overrides?: {
      search?: string;
      format?: string;
      condition?: string;
      minPrice?: string;
      maxPrice?: string;
    }
  ) => {
    try {
      setFilterError("");
      setBackendError("");
      setLoading(true);

      const nextSearch =
        overrides?.search ??
        search;

      const nextFormat =
        overrides?.format ??
        formatoChecked[0] ??
        "";

      const nextCondition =
        overrides?.condition ??
        condition;

      const nextMinPrice =
        overrides?.minPrice ??
        precioMin;

      const nextMaxPrice =
        overrides?.maxPrice ??
        precioMax;

      const min =
        nextMinPrice
          ? Number(
              nextMinPrice
            )
          : undefined;

      const max =
        nextMaxPrice
          ? Number(
              nextMaxPrice
            )
          : undefined;

      if (
        min !== undefined &&
        max !== undefined &&
        min > max
      ) {
        setFilterError(
          "El precio mínimo no puede ser mayor que el precio máximo."
        );

        return;
      }

      const selectedGenre =
        genreOverride ??
        generoActivo;

      const data =
        await filterPublications({
          q:
            nextSearch
              .trim() ||
            undefined,

          genre:
            selectedGenre ===
            "Todos"
              ? undefined
              : selectedGenre,

          format:
            nextFormat ||
            undefined,

          condition:
            nextCondition ||
            undefined,

          minPrice: min,
          maxPrice: max,
        });

      setPublicaciones(
        data
      );
    } catch (error) {
      console.error(
        "Error al aplicar filtros:",
        error
      );

      setBackendError(
        "No se pudieron aplicar los filtros."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch =
    async () => {
      await applyFilters();
    };

  const handleGenreChange =
    async (
      genre: string
    ) => {
      setGeneroActivo(
        genre
      );

      await applyFilters(
        genre
      );
    };

  const clearFilters =
    async () => {
      setSearch("");
      setFormatoChecked([]);
      setCondition("");
      setPrecioMin("");
      setPrecioMax("");
      setGeneroActivo(
        "Todos"
      );
      setFilterError("");
      setBackendError("");

      try {
        setLoading(true);

        const data =
          await getPublications();

        setPublicaciones(
          data
        );
      } catch (error) {
        console.error(
          "Error al limpiar filtros:",
          error
        );

        setBackendError(
          "No se pudieron cargar las publicaciones."
        );
      } finally {
        setLoading(false);
      }
    };

  const removeSingleFilter =
    async (
      type:
        | "search"
        | "genre"
        | "format"
        | "condition"
        | "price"
    ) => {
      let nextGenre =
        generoActivo;

      let nextSearch =
        search;

      let nextFormat =
        formatoChecked[0] ||
        "";

      let nextCondition =
        condition;

      let nextMinPrice =
        precioMin;

      let nextMaxPrice =
        precioMax;

      if (
        type ===
        "search"
      ) {
        nextSearch = "";
        setSearch("");
      }

      if (
        type ===
        "genre"
      ) {
        nextGenre =
          "Todos";

        setGeneroActivo(
          "Todos"
        );
      }

      if (
        type ===
        "format"
      ) {
        nextFormat = "";
        setFormatoChecked([]);
      }

      if (
        type ===
        "condition"
      ) {
        nextCondition = "";
        setCondition("");
      }

      if (
        type ===
        "price"
      ) {
        nextMinPrice = "";
        nextMaxPrice = "";

        setPrecioMin("");
        setPrecioMax("");
      }

      await applyFilters(
        nextGenre,
        {
          search:
            nextSearch,
          format:
            nextFormat,
          condition:
            nextCondition,
          minPrice:
            nextMinPrice,
          maxPrice:
            nextMaxPrice,
        }
      );
    };

  const sortedPublications =
    useMemo(() => {
      const sorted = [
        ...publicaciones,
      ];

      if (
        ordenar ===
        "Precio: menor a mayor"
      ) {
        return sorted.sort(
          (a, b) =>
            a.price -
            b.price
        );
      }

      if (
        ordenar ===
        "Precio: mayor a menor"
      ) {
        return sorted.sort(
          (a, b) =>
            b.price -
            a.price
        );
      }

      if (
        ordenar ===
        "Más antiguos"
      ) {
        return sorted.sort(
          (a, b) =>
            new Date(
              a.createdAt
            ).getTime() -
            new Date(
              b.createdAt
            ).getTime()
        );
      }

      return sorted.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
    }, [
      publicaciones,
      ordenar,
    ]);

  const hasActiveFilters =
    Boolean(
      search ||
        generoActivo !==
          "Todos" ||
        formatoChecked.length >
          0 ||
        condition ||
        precioMin ||
        precioMax
    );

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 flex gap-6">
      <Sidebar
        formatoChecked={
          formatoChecked
        }
        condition={
          condition
        }
        precioMin={
          precioMin
        }
        precioMax={
          precioMax
        }
        onToggleFormato={
          toggleFormato
        }
        onConditionChange={
          setCondition
        }
        onPrecioMinChange={
          setPrecioMin
        }
        onPrecioMaxChange={
          setPrecioMax
        }
        onApplyFilters={() =>
          applyFilters()
        }
        error={
          filterError
        }
      />

      <main className="flex-1 min-w-0">
        <div className="mb-5">
          <h1
            className="text-2xl font-bold mb-1"
            style={{
              color:
                "#e8eaf0",
            }}
          >
            Explorar
          </h1>

          <p
            className="text-[13px]"
            style={{
              color:
                "#8892a4",
            }}
          >
            Busca y filtra publicaciones por artista, género, formato, estado y precio.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {generos.map(
            (genre) => (
              <button
                key={
                  genre
                }
                onClick={() =>
                  handleGenreChange(
                    genre
                  )
                }
                className="text-[13px] px-4 py-1.5 rounded-full transition-colors"
                style={
                  generoActivo ===
                  genre
                    ? {
                        background:
                          "#f59e0b",
                        color:
                          "#0f1117",
                        fontWeight:
                          600,
                      }
                    : {
                        background:
                          "#1e2433",
                        color:
                          "#8892a4",
                        border:
                          "1px solid rgba(255,255,255,0.07)",
                      }
                }
              >
                {genre}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2.5"
            style={{
              background:
                "#1a1f2e",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
            }}
          >
            <Search
              size={14}
              style={{
                color:
                  "#4a5568",
              }}
              className="shrink-0"
            />

            <input
              type="text"
              value={
                search
              }
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              onKeyDown={(
                e
              ) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder="Buscar por artista, álbum o estilo..."
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{
                color:
                  "#e8eaf0",
              }}
            />
          </div>

          <button
            onClick={
              handleSearch
            }
            disabled={
              loading
            }
            className="text-[13px] font-semibold px-5 py-2.5 rounded flex items-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{
              background:
                "#f59e0b",
              color:
                "#0f1117",
            }}
          >
            <Search
              size={13}
            />

            Buscar
          </button>
        </div>

        {backendError && (
          <div
            className="rounded-lg p-4 mb-5 text-[13px]"
            style={{
              background:
                "rgba(239,68,68,0.08)",
              border:
                "1px solid rgba(239,68,68,0.2)",
              color:
                "#ef4444",
            }}
          >
            {backendError}
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {search && (
              <FilterChip
                text={`Búsqueda: ${search}`}
                onRemove={() =>
                  removeSingleFilter(
                    "search"
                  )
                }
              />
            )}

            {generoActivo !==
              "Todos" && (
              <FilterChip
                text={
                  generoActivo
                }
                onRemove={() =>
                  removeSingleFilter(
                    "genre"
                  )
                }
              />
            )}

            {formatoChecked[0] && (
              <FilterChip
                text={
                  formatoChecked[0]
                }
                onRemove={() =>
                  removeSingleFilter(
                    "format"
                  )
                }
              />
            )}

            {condition && (
              <FilterChip
                text={condition.replaceAll(
                  "_",
                  " "
                )}
                onRemove={() =>
                  removeSingleFilter(
                    "condition"
                  )
                }
              />
            )}

            {(precioMin ||
              precioMax) && (
              <FilterChip
                text={`Precio: ${precioMin || "0"} - ${precioMax || "∞"}`}
                onRemove={() =>
                  removeSingleFilter(
                    "price"
                  )
                }
              />
            )}

            <button
              onClick={
                clearFilters
              }
              className="text-[12px] hover:text-white transition-colors"
              style={{
                color:
                  "#4a5568",
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2
              className="text-[16px] font-bold"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              Publicaciones
            </h2>

            <p
              className="text-[11px] mt-1"
              style={{
                color:
                  "#6f7890",
              }}
            >
              {sortedPublications.length} resultado
              {sortedPublications.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          <select
            value={
              ordenar
            }
            onChange={(e) =>
              setOrdenar(
                e.target.value
              )
            }
            className="text-[12px] px-3 py-1.5 rounded outline-none"
            style={{
              background:
                "#1e2433",
              color:
                "#8892a4",
              border:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <option value="Más recientes">
              Más recientes
            </option>

            <option value="Más antiguos">
              Más antiguos
            </option>

            <option value="Precio: menor a mayor">
              Precio: menor a mayor
            </option>

            <option value="Precio: mayor a menor">
              Precio: mayor a menor
            </option>
          </select>
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
        ) : sortedPublications.length ===
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
            <h3
              className="text-[16px] font-semibold mb-2"
              style={{
                color:
                  "#e8eaf0",
              }}
            >
              No se encontraron publicaciones
            </h3>

            <p
              className="text-[13px] mb-5"
              style={{
                color:
                  "#8892a4",
              }}
            >
              Prueba modificando la búsqueda o alguno de los filtros seleccionados.
            </p>

            {hasActiveFilters && (
              <button
                onClick={
                  clearFilters
                }
                className="text-[13px] font-semibold px-5 py-2 rounded transition-opacity hover:opacity-90"
                style={{
                  background:
                    "#f59e0b",
                  color:
                    "#0f1117",
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedPublications.map(
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
      </main>
    </div>
  );
}

function FilterChip({
  text,
  onRemove,
}: {
  text: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
      style={{
        background:
          "#1e2433",
        color:
          "#8892a4",
        border:
          "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {text}

      <button
        onClick={
          onRemove
        }
        className="hover:text-white transition-colors ml-0.5"
      >
        <X
          size={10}
        />
      </button>
    </span>
  );
}
