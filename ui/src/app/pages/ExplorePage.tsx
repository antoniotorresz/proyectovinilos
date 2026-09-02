import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
} from "lucide-react";

import Sidebar from "../components/layout/Sidebar";
import PublicationCard from "../components/publications/PublicationCard";

import type { Publication } from "../types/Publication";

import {
  filterPublicationsPage,
  getPublications,
  getPublicationsPage,
} from "../services/publicationService";

import Pagination from "../components/pagination/Pagination";

import { useAuth } from "../context/AuthContext";
import { useFavorites } from "../context/FavoritesContext";

import { getFavoritePublications } from "../services/favoriteService";

import { useLocation, useSearchParams } from "react-router";

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

  const location = useLocation();

  const [searchParams, setSearchParams] =
  useSearchParams();

  const initialPage =
    Number(searchParams.get("page")) || 0;

  const [page, setPage] =
    useState(initialPage);
  const [favoritePage, setFavoritePage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 12;

  const [generos, setGeneros] =
    useState<string[]>(["Todos"]);

  const [filterError, setFilterError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [backendError, setBackendError] =
    useState("");

  const { user } = useAuth();

  const [onlyFavorites, setOnlyFavorites] =
    useState(false);

  const {
    favoriteIds,
  } = useFavorites();

  const [
    favoritePublications,
    setFavoritePublications,
  ] = useState<Publication[]>([]);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setLoading(true);
        setBackendError("");

        // Primera página paginada
        const data =
          await getPublicationsPage({
            page: initialPage,
            size: PAGE_SIZE,
            sort: [
              "createdAt,desc",
              "id,desc",
            ],
          });

        setPublicaciones(data.content);
        setPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);

        // Se obtienen todas temporalmente solo
        // para construir la lista dinámica de géneros
        const allPublications =
          await getPublications();

        const generosUnicos =
          Array.from(
            new Set(
              allPublications
                .map(
                  (publication) =>
                    publication.genre
                )
                .filter(
                  (
                    genre
                  ): genre is string =>
                    Boolean(genre)
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

  useEffect(() => {
    const loadFavoritePublications = async () => {
      if (!user) {
        setFavoritePublications([]);
        return;
      }

      try {
        const data =
          await getFavoritePublications(
            user.id
          );

        setFavoritePublications(data);
      } catch (error) {
        console.error(
          "Error al cargar publicaciones favoritas:",
          error
        );
      }
    };

    loadFavoritePublications();
  }, [user?.id, favoriteIds]);

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

  const getBackendSort = (): string[] => {
    switch (ordenar) {
      case "Precio: menor a mayor":
        return [
          "price,asc",
          "id,asc",
        ];

      case "Precio: mayor a menor":
        return [
          "price,desc",
          "id,desc",
        ];

      case "Más antiguos":
        return [
          "createdAt,asc",
          "id,asc",
        ];

      case "Más recientes":
      default:
        return [
          "createdAt,desc",
          "id,desc",
        ];
    }
  };

  const applyFilters = async (
    genreOverride?: string,
    overrides?: {
      search?: string;
      format?: string;
      condition?: string;
      minPrice?: string;
      maxPrice?: string;
    },
    targetPage = 0
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
        await filterPublicationsPage({
          q: nextSearch.trim() || undefined,

          genre:
            selectedGenre === "Todos"
              ? undefined
              : selectedGenre,

          format:
            nextFormat || undefined,

          condition:
            nextCondition || undefined,

          minPrice: min,
          maxPrice: max,

          page: targetPage,
          size: PAGE_SIZE,
          sort: getBackendSort(),
        });

      setPublicaciones(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
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

  const handlePageChange = async (
    nextPage: number
  ) => {
    if (
      nextPage < 0 ||
      nextPage >= totalPages ||
      nextPage === page
    ) {
      return;
    }

    // Actualizar inmediatamente la URL
    setSearchParams({
      page: nextPage.toString(),
    });

    // Cargar la página seleccionada
    await applyFilters(
      generoActivo,
      undefined,
      nextPage
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          await getPublicationsPage({
                page: 0,
                size: PAGE_SIZE,
                sort: [
                  "createdAt,desc",
                  "id,desc",
                ],
      });

        setPublicaciones(data.content);
        setPage(data.number);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setSearchParams((prev) => {
          const next =
            new URLSearchParams(prev);

          next.set("page", "0");

          return next;
        });

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

  const sortedPublications = useMemo(() => {
    let basePublications =
      onlyFavorites
        ? [...favoritePublications]
        : [...publicaciones];

    /*
    * Cuando estamos viendo favoritos,
    * los filtros se aplican localmente porque
    * ya tenemos todas las publicaciones favoritas.
    */
    if (onlyFavorites) {
      const term =
        search.trim().toLowerCase();

      if (term) {
        basePublications =
          basePublications.filter(
            (publication) =>
              publication.name
                ?.toLowerCase()
                .includes(term) ||
              publication.albumName
                ?.toLowerCase()
                .includes(term) ||
              publication.artist
                ?.toLowerCase()
                .includes(term) ||
              publication.genre
                ?.toLowerCase()
                .includes(term)
          );
      }

      if (
        generoActivo !== "Todos"
      ) {
        basePublications =
          basePublications.filter(
            (publication) =>
              publication.genre ===
              generoActivo
          );
      }

      if (formatoChecked[0]) {
        basePublications =
          basePublications.filter(
            (publication) =>
              publication.format ===
              formatoChecked[0]
          );
      }

      if (condition) {
        basePublications =
          basePublications.filter(
            (publication) =>
              publication.condition ===
              condition
          );
      }

      if (precioMin) {
        const min =
          Number(precioMin);

        basePublications =
          basePublications.filter(
            (publication) =>
              Number(
                publication.price
              ) >= min
          );
      }

      if (precioMax) {
        const max =
          Number(precioMax);

        basePublications =
          basePublications.filter(
            (publication) =>
              Number(
                publication.price
              ) <= max
          );
      }
    }

    if (
      ordenar ===
      "Precio: menor a mayor"
    ) {
      return basePublications.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (
      ordenar ===
      "Precio: mayor a menor"
    ) {
      return basePublications.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    if (
      ordenar ===
      "Más antiguos"
    ) {
      return basePublications.sort(
        (a, b) =>
          new Date(
            a.createdAt
          ).getTime() -
          new Date(
            b.createdAt
          ).getTime()
      );
    }

    return basePublications.sort(
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
    favoritePublications,
    onlyFavorites,
    search,
    generoActivo,
    formatoChecked,
    condition,
    precioMin,
    precioMax,
    ordenar,
  ]);

  const favoriteTotalPages =
    Math.ceil(
      sortedPublications.length /
        PAGE_SIZE
    );

  const favoritePagePublications =
    onlyFavorites
      ? sortedPublications.slice(
          favoritePage * PAGE_SIZE,
          favoritePage * PAGE_SIZE +
            PAGE_SIZE
        )
      : sortedPublications;

  const visiblePublications =
    favoritePagePublications;
  const hasActiveFilters =
    Boolean(
      search ||
        onlyFavorites ||
        generoActivo !==
          "Todos" ||
        formatoChecked.length >
          0 ||
        condition ||
        precioMin ||
        precioMax
    );

    const resultCount = onlyFavorites
      ? sortedPublications.length
      : totalElements;

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 flex gap-6">
      <Sidebar
        generos={generos}

        generoActivo={generoActivo}

        onGenreChange={setGeneroActivo} 

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
        showFavorites={Boolean(user)}
        onlyFavorites={onlyFavorites}
        onOnlyFavoritesChange={(value) => {
          setOnlyFavorites(value);

          if (value) {
            setFavoritePage(0);
          }
        }}
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
              {resultCount} resultado
              {resultCount !== 1 ? "s" : ""}
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
            onChange={async (e) => {
              const newOrder = e.target.value;

              setOrdenar(newOrder);

              if (onlyFavorites) {
                setFavoritePage(0);
                return;
              }

              setPage(0);

              try {
                setLoading(true);

                const sort =
                  newOrder === "Precio: menor a mayor"
                    ? ["price,asc", "id,asc"]
                    : newOrder === "Precio: mayor a menor"
                    ? ["price,desc", "id,desc"]
                    : newOrder === "Más antiguos"
                    ? ["createdAt,asc", "id,asc"]
                    : ["createdAt,desc", "id,desc"];

                const data =
                  await filterPublicationsPage({
                    q: search.trim() || undefined,
                    genre:
                      generoActivo === "Todos"
                        ? undefined
                        : generoActivo,
                    format:
                      formatoChecked[0] || undefined,
                    condition:
                      condition || undefined,
                    minPrice:
                      precioMin
                        ? Number(precioMin)
                        : undefined,
                    maxPrice:
                      precioMax
                        ? Number(precioMax)
                        : undefined,
                    page: 0,
                    size: PAGE_SIZE,
                    sort,
                  });

                setPublicaciones(data.content);
                setPage(data.number);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
              } catch (error) {
                console.error(
                  "Error al ordenar publicaciones:",
                  error
                );

                setBackendError(
                  "No se pudieron ordenar las publicaciones."
                );
              } finally {
                setLoading(false);
              }
            }}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visiblePublications.map(
                (publication) => (
                  <PublicationCard
                    key={publication.id}
                    publication={publication}
                  />
                )
              )}
            </div>

            <Pagination
              page={
                onlyFavorites
                  ? favoritePage
                  : page
              }
              totalPages={
                onlyFavorites
                  ? favoriteTotalPages
                  : totalPages
              }
              totalElements={
                onlyFavorites
                  ? sortedPublications.length
                  : totalElements
              }
              pageSize={PAGE_SIZE}
              onPageChange={
                onlyFavorites
                  ? (nextPage) => {
                      setFavoritePage(nextPage);

                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  : handlePageChange
              }
            />
          </>
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
