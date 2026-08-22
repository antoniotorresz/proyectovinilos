import { ShoppingBag, User, Music } from "lucide-react";
import { NavLink } from "react-router";

export default function Header() {
  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Explorar", path: "/explore" },
    { label: "Publicar", path: "/publish" },
    { label: "Mis publicaciones", path: "/my-publications" },
    { label: "Mi perfil", path: "/profile" },
  ];

  return (
    <header style={{ background: "#161b27", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-14">

        <NavLink to="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ background: "#f59e0b" }}
          >
            <Music size={16} color="#0f1117" />
          </div>

          <span
            className="font-bold text-[15px] tracking-wide"
            style={{ color: "#e8eaf0" }}
          >
            Music Market
          </span>
        </NavLink>

        <nav
          className="hidden md:flex items-center gap-7 text-[13px]"
          style={{ color: "#8892a4" }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="transition-colors hover:text-white"
              style={({ isActive }) => ({
                color: isActive ? "#f59e0b" : "#8892a4",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div
          className="flex items-center gap-4"
          style={{ color: "#8892a4" }}
        >
          <ShoppingBag
            size={18}
            className="cursor-pointer hover:text-white transition-colors"
          />

          <NavLink
            to="/profile"
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80"
            style={{ background: "#2d3548" }}
          >
            <User size={15} />
          </NavLink>
        </div>
      </div>
    </header>
  );
}