const FORMATOS = ["Vinilo", "CD", "Cassette"];

interface SidebarProps {
  formatoChecked: string[];
  estadoNuevo: boolean;
  estadoUsado: boolean;
  precioMin: string;
  precioMax: string;
  onToggleFormato: (formato: string) => void;
  onEstadoNuevoChange: () => void;
  onEstadoUsadoChange: () => void;
  onPrecioMinChange: (value: string) => void;
  onPrecioMaxChange: (value: string) => void;
  onApplyFilters: () => void;
}

export default function Sidebar({
  formatoChecked,
  estadoNuevo,
  estadoUsado,
  precioMin,
  precioMax,
  onToggleFormato,
  onEstadoNuevoChange,
  onEstadoUsadoChange,
  onPrecioMinChange,
  onPrecioMaxChange,
  onApplyFilters,
}: SidebarProps) {
  return (
    <aside className="w-[210px] shrink-0">
      <div
        className="rounded-lg p-4"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <h3
          className="text-[11px] font-bold tracking-widest uppercase mb-4"
          style={{ color: "#8892a4" }}
        >
          Filtros
        </h3>

        <div className="mb-5">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#c4c8d8" }}
          >
            Formato
          </p>

          <div className="space-y-2">
            {FORMATOS.map((f) => (
              <label
                key={f}
                className="flex items-center gap-2 text-[13px] cursor-pointer"
                style={{ color: "#8892a4" }}
              >
                <input
                  type="checkbox"
                  checked={formatoChecked.includes(f)}
                  onChange={() => onToggleFormato(f)}
                  className="rounded"
                  style={{ accentColor: "#f59e0b" }}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#c4c8d8" }}
          >
            Estado
          </p>

          <div className="space-y-2">
            <label
              className="flex items-center gap-2 text-[13px] cursor-pointer"
              style={{ color: "#8892a4" }}
            >
              <input
                type="checkbox"
                checked={estadoNuevo}
                onChange={onEstadoNuevoChange}
                style={{ accentColor: "#f59e0b" }}
              />
              Nuevo
            </label>

            <label
              className="flex items-center gap-2 text-[13px] cursor-pointer"
              style={{ color: "#8892a4" }}
            >
              <input
                type="checkbox"
                checked={estadoUsado}
                onChange={onEstadoUsadoChange}
                style={{ accentColor: "#f59e0b" }}
              />
              Usado
            </label>
          </div>
        </div>

        <div className="mb-5">
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-2"
            style={{ color: "#c4c8d8" }}
          >
            Precio
          </p>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Min"
              value={precioMin}
              onChange={(e) => onPrecioMinChange(e.target.value)}
              className="w-full text-[12px] px-2 py-1.5 outline-none"
              style={{
                background: "#1e2433",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e8eaf0",
                borderRadius: 4,
              }}
            />

            <span className="text-[12px]" style={{ color: "#4a5568" }}>
              –
            </span>

            <input
              type="text"
              placeholder="Max"
              value={precioMax}
              onChange={(e) => onPrecioMaxChange(e.target.value)}
              className="w-full text-[12px] px-2 py-1.5 outline-none"
              style={{
                background: "#1e2433",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e8eaf0",
                borderRadius: 4,
              }}
            />
          </div>
        </div>

        <button
          onClick={onApplyFilters}
          className="w-full text-[13px] font-semibold py-2 rounded transition-opacity hover:opacity-90"
          style={{ background: "#f59e0b", color: "#0f1117" }}
        >
          Aplicar filtros
        </button>
      </div>

      <div className="mt-5 px-1">
        <p
          className="text-[11px] font-bold tracking-widest uppercase mb-1"
          style={{ color: "#f59e0b" }}
        >
          Music Market
        </p>

        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "#4a5568" }}
        >
          La primera plataforma de música para comprar y vender productos de la industria.
        </p>
      </div>
    </aside>
  );
}