import { useEffect, useState } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import PublicationCard from "../components/publications/PublicationCard";
import type { Publication } from "../types/Publication";
import { getPublications } from "../services/publicationService";

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

const GENEROS = ["Todos", "Rock", "Clásica", "Jazz", "Pop"];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [formatoChecked, setFormatoChecked] = useState<string[]>(["Vinilo"]);
  const [estadoNuevo, setEstadoNuevo] = useState(false);
  const [estadoUsado, setEstadoUsado] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [generoActivo, setGeneroActivo] = useState("Todos");
  const [activeFilters, setActiveFilters] = useState<string[]>(["Vinilo", "Rock"]);
  const [ordenar] = useState("Más recientes");
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [backendDisponible, setBackendDisponible] = useState(false);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        const data = await getPublications();
        setPublicaciones(data);
        setBackendDisponible(true);
      } catch (error) {
        console.error("Backend no disponible:", error);
        setBackendDisponible(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const toggleFormato = (f: string) => {
    setFormatoChecked((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  };

  const removeFilter = (f: string) => {
    setActiveFilters((prev) => prev.filter((x) => x !== f));
  };

  return (
    <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 flex gap-6">
      <Sidebar
        formatoChecked={formatoChecked}
        estadoNuevo={estadoNuevo}
        estadoUsado={estadoUsado}
        precioMin={precioMin}
        precioMax={precioMax}
        onToggleFormato={toggleFormato}
        onEstadoNuevoChange={() => setEstadoNuevo(!estadoNuevo)}
        onEstadoUsadoChange={() => setEstadoUsado(!estadoUsado)}
        onPrecioMinChange={setPrecioMin}
        onPrecioMaxChange={setPrecioMax}
        onApplyFilters={() => {}}
      />

      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {GENEROS.map((g) => (
            <button
              key={g}
              onClick={() => setGeneroActivo(g)}
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
              placeholder="Buscar por artista, álbum o estilo..."
              className="flex-1 text-[13px] outline-none bg-transparent"
              style={{ color: "#e8eaf0" }}
            />
          </div>

          <button
            className="text-[13px] font-semibold px-5 py-2.5 rounded flex items-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "#f59e0b", color: "#0f1117" }}
          >
            <Search size={13} />
            Buscar
          </button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            {activeFilters.map((f) => (
              <span
                key={f}
                className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {f}
                <button
                  onClick={() => removeFilter(f)}
                  className="hover:text-white transition-colors ml-0.5"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            <button
              onClick={() => setActiveFilters([])}
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

          <button
            className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded transition-colors hover:opacity-80"
            style={{
              background: "#1e2433",
              color: "#8892a4",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {ordenar}
            <ChevronDown size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(backendDisponible ? publicaciones : PUBLICACIONES).map((pub: any, i) => (
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
          ))}
        </div>
      </main>
    </div>
  );
}