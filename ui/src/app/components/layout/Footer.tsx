import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#161b27",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
      className="mt-10"
    >
      <div className="max-w-[1200px] mx-auto px-5 py-10 grid grid-cols-3 gap-8">
        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{ color: "#f59e0b" }}
          >
            Navegación
          </h4>

          <ul className="space-y-2">
            {["Inicio", "Explorar", "Publicar", "Sobre nosotros"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[13px] transition-colors hover:text-white"
                  style={{ color: "#8892a4" }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{ color: "#f59e0b" }}
          >
            Ayuda
          </h4>

          <ul className="space-y-2">
            {[
              "Preguntas frecuentes",
              "Contacto",
              "Términos y condiciones",
              "Privacidad",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[13px] transition-colors hover:text-white"
                  style={{ color: "#8892a4" }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{ color: "#f59e0b" }}
          >
            Síguenos
          </h4>

          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter].map((Icon, index) => (
              <div
                key={index}
                className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:opacity-80"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Icon size={15} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}