import {
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer
      style={{
        background: "#161b27",
        borderTop:
          "1px solid rgba(255,255,255,0.07)",
      }}
      className="mt-10"
    >
      <div className="max-w-[1200px] mx-auto px-5 py-10 grid grid-cols-3 gap-8">

        {/* NAVEGACIÓN */}

        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{
              color: "#f59e0b",
            }}
          >
            Navegación
          </h4>

          <ul className="space-y-2">
            <li>
              <FooterLink
                to="/"
                label="Inicio"
              />
            </li>

            <li>
              <FooterLink
                to="/explore"
                label="Explorar"
              />
            </li>

            <li>
              <FooterLink
                to="/publish"
                label="Publicar"
              />
            </li>

            <li>
              <PlaceholderLink label="Sobre nosotros" />
            </li>
          </ul>
        </div>

        {/* AYUDA */}

        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{
              color: "#f59e0b",
            }}
          >
            Ayuda
          </h4>

          <ul className="space-y-2">
            <li>
              <PlaceholderLink label="Preguntas frecuentes" />
            </li>

            <li>
              <PlaceholderLink label="Contacto" />
            </li>

            <li>
              <PlaceholderLink label="Términos y condiciones" />
            </li>

            <li>
              <PlaceholderLink label="Privacidad" />
            </li>
          </ul>
        </div>

        {/* REDES */}

        <div>
          <h4
            className="text-[11px] font-bold tracking-widest uppercase mb-4"
            style={{
              color: "#f59e0b",
            }}
          >
            Síguenos
          </h4>

          <div className="flex gap-3">
            <SocialButton
              icon={<Facebook size={15} />}
              label="Facebook"
            />

            <SocialButton
              icon={<Instagram size={15} />}
              label="Instagram"
            />

            <SocialButton
              icon={<Twitter size={15} />}
              label="Twitter"
            />
          </div>

          <p
            className="text-[11px] mt-5 leading-5"
            style={{
              color: "#6f7890",
            }}
          >
            Music Market
            <br />
            Marketplace de música para
            coleccionistas.
          </p>
        </div>
      </div>

      {/* PIE INFERIOR */}

      <div
        style={{
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="max-w-[1200px] mx-auto px-5 py-4 flex items-center justify-between gap-4 text-[11px]"
          style={{
            color: "#596276",
          }}
        >
          <span>
            © {new Date().getFullYear()} Music Market
          </span>

          <span>
            Proyecto académico · UNIR
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className="text-[13px] transition-colors hover:text-white"
      style={{
        color: "#8892a4",
      }}
    >
      {label}
    </NavLink>
  );
}

function PlaceholderLink({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="text-[13px] text-left cursor-default"
      style={{
        color: "#8892a4",
      }}
      title="Disponible próximamente"
    >
      {label}
    </button>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={`${label} - Próximamente`}
      className="w-9 h-9 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
      style={{
        background: "#1e2433",
        color: "#8892a4",
        border:
          "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {icon}
    </button>
  );
}