import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import PublicationCard from "../components/publications/PublicationCard";
import type { Publication } from "../types/Publication";
import {
  getPublications,
  filterPublications,
} from "../services/publicationService";

const PINK_FLOYD_IMG = "https://images.unsplash.com/photo-1639023698782-71ef93c6af90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const BEATLES_IMG = "https://images.unsplash.com/photo-1748239994589-95ec583d9e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";
const NIRVANA_IMG = "https://images.unsplash.com/photo-1619983081563-430f63602796?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400";

const PUBLICACIONES = [
  {
    titulo: "The Dark Side of the Moon",
    artista: "Pink Floyd",
    precio: "USD 15.0",
    condicion: "Nuevo",
    img: PINK_FLOYD_IMG,
  },
  {
    titulo: "Abbey Road",
    artista: "The Beatles",
    precio: "USD 20.0",
    condicion: "Usado",
    img: BEATLES_IMG,
  },
  {
    titulo: "Nevermind",
    artista: "Nirvana",
    precio: "USD 12.0",
    condicion: "Usado",
    img: NIRVANA_IMG,
  },
];


export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [formatoChecked, setFormatoChecked] = useState<string[]>(["Vinilo"]);
  const [condition, setCondition] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [generoActivo, setGeneroActivo] = useState("Todos");
  const [ordenar, setOrdenar] = useState("Más recientes");
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [backendDisponible, setBackendDisponible] = useState(false);
  const [filterError, setFilterError] = useState("");

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        const data = await getPublications();
        setPublicaciones(data);
        setBackendDisponible(true);
        const generosUnicos = Array.from(
          new Set(
            data
              .map((publication) => publication.genre)
              .filter((genre): genre is string => Boolean(genre))
          )
        ).sort();

setGeneros(["Todos", ...generosUnicos]);
      } catch (error) {
        console.error("Backend no disponible:", error);
        setBackendDisponible(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const toggleFormato = (format: string) => {
    setFormatoChecked((prev) =>
      prev.includes(format) ? [] : [format]
    );
  };

  const applyFilters = async (genreOverride?: string) => {
    try {
          setFilterError("");
          const min = precioMin ? Number(precioMin) : undefined;
          const max = precioMax ? Number(precioMax) : undefined;

          if (min !== undefined && max !== undefined && min > max) {
            setFilterError("El precio mínimo no puede ser mayor que el precio máximo.");
            return;
          }
          const selectedGenre = genreOverride ?? generoActivo;

          const data = await filterPublications({
            q: search.trim() || undefined,
            genre: selectedGenre === "Todos" ? undefined : selectedGenre,
            format: formatoChecked[0] || undefined,
            condition: condition || undefined,
            minPrice: min,
            maxPrice: max,
      });

      setPublicaciones(data);
      setBackendDisponible(true);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  };

  const handleSearch = async () => {
    await applyFilters();
  };

  const handleGenreChange = async (genre: string) => {
    setGeneroActivo(genre);
    await applyFilters(genre);
  };

  const clearFilters = async () => {
    setSearch("");
    setFormatoChecked([]);
    setCondition("");
    setPrecioMin("");
    setPrecioMax("");
    setGeneroActivo("Todos");

    try {
      const data = await getPublications();
      setPublicaciones(data);
      setBackendDisponible(true);
    } catch (error) {
      console.error("Error al limpiar filtros:", error);
    }
  };

  const removeSingleFilter = async (type: string) => {
    let nextGenre = generoActivo;
    let nextFormat = formatoChecked[0] || "";
    let nextCondition = condition;
    let nextMinPrice = precioMin;
    let nextMaxPrice = precioMax;
    let nextSearch = search;

    if (type === "search") {
      nextSearch = "";
      setSearch("");
    }

    if (type === "genre") {
      nextGenre = "Todos";
      setGeneroActivo("Todos");
    }

    if (type === "format") {
      nextFormat = "";
      setFormatoChecked([]);
    }

    if (type === "condition") {
      nextCondition = "";
      setCondition("");
    }

    if (type === "price") {
      nextMinPrice = "";
      nextMaxPrice = "";
      setPrecioMin("");
      setPrecioMax("");
    }

    try {
      const data = await filterPublications({
        q: nextSearch.trim() || undefined,
        genre: nextGenre === "Todos" ? undefined : nextGenre,
        format: nextFormat || undefined,
        condition: nextCondition || undefined,
        minPrice: nextMinPrice ? Number(nextMinPrice) : undefined,
        maxPrice: nextMaxPrice ? Number(nextMaxPrice) : undefined,
      });

      setPublicaciones(data);
      setBackendDisponible(true);
    } catch (error) {
      console.error("Error al quitar filtro:", error);
    }
  };

  const getSortedPublications = () => {
    const sorted = [...publicaciones];

    if (ordenar === "Precio: menor a mayor") {
      return sorted.sort((a, b) => a.price - b.price);
    }

    if (ordenar === "Precio: mayor a menor") {
      return sorted.sort((a, b) => b.price - a.price);
    }

    if (ordenar === "Más antiguos") {
      return sorted.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );
    }

    return sorted.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  };

  const [generos, setGeneros] = useState<string[]>(["Todos"]);

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 flex gap-6">
      <Sidebar
        formatoChecked={formatoChecked}
        condition={condition}
        precioMin={precioMin}
        precioMax={precioMax}
        onToggleFormato={toggleFormato}
        onConditionChange={setCondition}
        onPrecioMinChange={setPrecioMin}
        onPrecioMaxChange={setPrecioMax}
        onApplyFilters={() => applyFilters()}
        error={filterError}
      />

      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {generos.map((g) => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className="text-[13px] px-4 py-1.5 rounded-full transition-colors"
              style={
                generoActivo === g
                  ? { background: "#f59e0b", color: "#0f1117", fontWeight: 600 }
                  : {
                      background: "#1e2433",
                      color: "#8892a4",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }
              }
            >
              {g}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div
            className="flex-1 flex items-center gap-2 px-3 py-2.5"
            style={{
              background: "#1a1f2e",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
            }}
          >
            <Search size={14} style={{ color: "#4a5568" }} className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              placeholder="Buscar por artista, álbum o estilo..."
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{ color: "#e8eaf0" }}
            />
          </div>

          <button
            onClick={handleSearch}
            className="text-[13px] font-semibold px-5 py-2.5 rounded flex items-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "#f59e0b", color: "#0f1117" }}
          >
            <Search size={13} />
            Buscar
          </button>
        </div>

        {(
          search ||
          generoActivo !== "Todos" ||
          formatoChecked.length > 0 ||
          condition ||
          precioMin ||
          precioMax
        ) && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">

            {search && (
              <span
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Búsqueda: {search}
                <button
                  onClick={() => removeSingleFilter("search")}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {generoActivo !== "Todos" && (
              <span
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {generoActivo}
                <button
                  onClick={() => removeSingleFilter("genre")}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {formatoChecked[0] && (
              <span
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {formatoChecked[0]}
                <button
                  onClick={() => removeSingleFilter("format")}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {condition && (
              <span
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {condition.replaceAll("_", " ")}
                <button
                  onClick={() => removeSingleFilter("condition")}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {(precioMin || precioMax) && (
              <span
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Precio: {precioMin || "0"} - {precioMax || "∞"}
                <button
                  onClick={() => removeSingleFilter("price")}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            <button
              onClick={clearFilters}
              className="text-[12px] hover:text-white transition-colors"
              style={{ color: "#4a5568" }}
            >
              Limpiar filtros
            </button>

          </div>
        )}

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold" style={{ color: "#e8eaf0" }}>
            Publicaciones destacadas
          </h2>

          <select
            value={ordenar}
            onChange={(e) => setOrdenar(e.target.value)}
            className="text-[12px] px-3 py-1.5 rounded outline-none"
            style={{
              background: "#1e2433",
              color: "#8892a4",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <option value="Más recientes">Más recientes</option>
            <option value="Más antiguos">Más antiguos</option>
            <option value="Precio: menor a mayor">
              Precio: menor a mayor
            </option>
            <option value="Precio: mayor a menor">
              Precio: mayor a menor
            </option>
          </select>
        </div>

        {backendDisponible && publicaciones.length === 0 ? (
          <div
            className="rounded-lg p-10 text-center"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <h3
              className="text-[16px] font-semibold mb-2"
              style={{ color: "#e8eaf0" }}
            >
              No se encontraron publicaciones
            </h3>

            <p
              className="text-[13px] mb-5"
              style={{ color: "#8892a4" }}
            >
              Prueba modificando la búsqueda o alguno de los filtros seleccionados.
            </p>

            <button
              onClick={clearFilters}
              className="text-[13px] font-semibold px-5 py-2 rounded transition-opacity hover:opacity-90"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(backendDisponible ? getSortedPublications() : PUBLICACIONES).map(
              (pub: any, i) => (
                <PublicationCard
                  key={pub.id ?? i}
                  publication={
                    backendDisponible
                      ? pub
                      : {
                          id: i,
                          name: pub.titulo,
                          albumName: pub.titulo,
                          artist: pub.artista,
                          price: Number(pub.precio.replace("USD ", "")),
                          condition: pub.condicion,
                          imageUris: [pub.img],
                          createdAt: "",
                        }
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