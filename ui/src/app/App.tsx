import { useEffect, useState } from "react";
import { Search, X, ShoppingBag, User, ChevronDown, Music, Facebook, Instagram, Twitter } from "lucide-react";
import type { Publication } from "./types/Publication";
import { getPublications } from "./services/publicationService";

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
    rating: 1,
  },
  {
    titulo: "Abbey Road",
    artista: "The Beatles",
    precio: "USD 20.0",
    condicion: "Usado",
    img: BEATLES_IMG,
    rating: 1,
  },
  {
    titulo: "Nevermind",
    artista: "Nirvana",
    precio: "USD 12.0",
    condicion: "Usado",
    img: NIRVANA_IMG,
    rating: 1,
  },
];

const FORMATOS = ["Vinilo", "CD", "Cassette"];
const GENEROS = ["Todos", "Rock", "Clásica", "Jazz", "Pop"];

export default function App() {

  const [search, setSearch] = useState("");
  const [formatoChecked, setFormatoChecked] = useState<string[]>(["Vinilo"]);
  const [estadoNuevo, setEstadoNuevo] = useState(false);
  const [estadoUsado, setEstadoUsado] = useState(false);
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [generoActivo, setGeneroActivo] = useState("Todos");
  const [activeFilters, setActiveFilters] = useState<string[]>(["Vinilo", "Rock"]);
  const [ordenar, setOrdenar] = useState("Más recientes");
  const [publicaciones, setPublicaciones] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const toggleFormato = (f: string) =>
    setFormatoChecked((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);

  const removeFilter = (f: string) => setActiveFilters((prev) => prev.filter((x) => x !== f));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f1117", color: "#e8eaf0", fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{ background: "#161b27", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "#f59e0b" }}>
              <Music size={16} color="#0f1117" />
            </div>
            <span className="font-bold text-[15px] tracking-wide" style={{ color: "#e8eaf0" }}>
              Music Market
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-[13px]" style={{ color: "#8892a4" }}>
            {["Inicio", "Explorar", "Publicar", "Mis publicaciones", "Mi perfil"].map((n) => (
              <a
                key={n}
                href="#"
                className="hover:text-white transition-colors"
                style={n === "Publicar" ? { color: "#f59e0b" } : undefined}
              >
                {n}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4" style={{ color: "#8892a4" }}>
            <ShoppingBag size={18} className="cursor-pointer hover:text-white transition-colors" />
            <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80" style={{ background: "#2d3548" }}>
              <User size={15} />
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-5 py-6 flex gap-6">

        {/* ── SIDEBAR ── */}
        <aside className="w-[210px] shrink-0">
          <div className="rounded-lg p-4" style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: "#8892a4" }}>
              Filtros
            </h3>

            {/* Formato */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#c4c8d8" }}>Formato</p>
              <div className="space-y-2">
                {FORMATOS.map((f) => (
                  <label key={f} className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "#8892a4" }}>
                    <input
                      type="checkbox"
                      checked={formatoChecked.includes(f)}
                      onChange={() => toggleFormato(f)}
                      className="rounded"
                      style={{ accentColor: "#f59e0b" }}
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Estado */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#c4c8d8" }}>Estado</p>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "#8892a4" }}>
                  <input type="checkbox" checked={estadoNuevo} onChange={() => setEstadoNuevo(!estadoNuevo)} style={{ accentColor: "#f59e0b" }} />
                  Nuevo
                </label>
                <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "#8892a4" }}>
                  <input type="checkbox" checked={estadoUsado} onChange={() => setEstadoUsado(!estadoUsado)} style={{ accentColor: "#f59e0b" }} />
                  Usado
                </label>
              </div>
            </div>

            {/* Precio */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#c4c8d8" }}>Precio</p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Min"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="w-full text-[12px] px-2 py-1.5 outline-none"
                  style={{ background: "#1e2433", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaf0", borderRadius: 4 }}
                />
                <span className="text-[12px]" style={{ color: "#4a5568" }}>–</span>
                <input
                  type="text"
                  placeholder="Max"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="w-full text-[12px] px-2 py-1.5 outline-none"
                  style={{ background: "#1e2433", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaf0", borderRadius: 4 }}
                />
              </div>
            </div>

            <button
              className="w-full text-[13px] font-semibold py-2 rounded transition-opacity hover:opacity-90"
              style={{ background: "#f59e0b", color: "#0f1117" }}
            >
              Aplicar filtros
            </button>
          </div>

          {/* Branding blurb */}
          <div className="mt-5 px-1">
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: "#f59e0b" }}>Music Market</p>
            <p className="text-[11px] leading-relaxed" style={{ color: "#4a5568" }}>
              La primera plataforma de música para comprar y vender productos de la industria.
            </p>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 min-w-0">

          {/* Genre tabs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {GENEROS.map((g) => (
              <button
                key={g}
                onClick={() => setGeneroActivo(g)}
                className="text-[13px] px-4 py-1.5 rounded-full transition-colors"
                style={
                  generoActivo === g
                    ? { background: "#f59e0b", color: "#0f1117", fontWeight: 600 }
                    : { background: "#1e2433", color: "#8892a4", border: "1px solid rgba(255,255,255,0.07)" }
                }
              >
                {g}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5"
              style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6 }}>
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

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {activeFilters.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1 text-[12px] px-3 py-1 rounded-full"
                  style={{ background: "#1e2433", color: "#8892a4", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {f}
                  <button onClick={() => removeFilter(f)} className="hover:text-white transition-colors ml-0.5">
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

          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[16px] font-bold" style={{ color: "#e8eaf0" }}>Publicaciones destacadas</h2>
            <button
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded transition-colors hover:opacity-80"
              style={{ background: "#1e2433", color: "#8892a4", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {ordenar}
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Publications grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(backendDisponible ? publicaciones : PUBLICACIONES).map((pub: any, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                {/* Album image */}
                <div className="relative w-full" style={{ paddingTop: "70%" }}>
                  <img
                    src={pub.imageUris?.[0] || pub.img}
                    alt={pub.albumName || pub.name || pub.titulo}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Condition badge */}
                  <span
                    className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded"
                    style={
                      (pub.condition || pub.condicion) === "Nuevo"
                        ? { background: "#f59e0b", color: "#0f1117" }
                        : { background: "rgba(0,0,0,0.6)", color: "#c4c8d8", border: "1px solid rgba(255,255,255,0.2)" }
                    }
                  >
                    {pub.condition || pub.condicion}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <div className="text-[14px] font-semibold leading-tight mb-0.5" style={{ color: "#e8eaf0" }}>
                    {pub.albumName || pub.name || pub.titulo}
                  </div>
                  <div className="text-[12px] mb-3" style={{ color: "#8892a4" }}>{pub.artist || pub.artista}</div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[15px] font-bold" style={{ color: "#f59e0b" }}>{typeof pub.price === "number" ? `USD ${pub.price.toFixed(2)}` : pub.precio}</span>
                  </div>
                  <button
                    className="w-full text-[13px] font-medium py-2 rounded transition-colors hover:opacity-80"
                    style={{ background: "#1e2433", color: "#c4c8d8", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#161b27", borderTop: "1px solid rgba(255,255,255,0.07)" }} className="mt-10">
        <div className="max-w-[1200px] mx-auto px-5 py-10 grid grid-cols-3 gap-8">
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: "#f59e0b" }}>Navegación</h4>
            <ul className="space-y-2">
              {["Inicio", "Explorar", "Publicar", "Sobre nosotros"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: "#8892a4" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: "#f59e0b" }}>Ayuda</h4>
            <ul className="space-y-2">
              {["Preguntas frecuentes", "Contacto", "Términos y condiciones", "Privacidad"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] transition-colors hover:text-white" style={{ color: "#8892a4" }}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: "#f59e0b" }}>Síguenos</h4>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
                  style={{ background: "#1e2433", color: "#8892a4", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Icon size={15} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
