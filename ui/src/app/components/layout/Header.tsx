import { ShoppingBag, User, Music } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Explorar", path: "/explore" },
    { label: "Publicar", path: "/publish" },
    { label: "Mis publicaciones", path: "/my-publications" },
    { label: "Mi perfil", path: "/profile" },
  ];
  const visibleNavItems =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? [
          ...navItems,
          { label: "Administración", path: "/admin" },
        ]
      : navItems;

  const handleLogout = () => {
    navigate("/", { replace: true });

    setTimeout(() => {
      logout();
    }, 0);
  };

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
          {visibleNavItems.map((item) => {
            const privateRoute = [
              "/publish",
              "/my-publications",
              "/profile",
            ].includes(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                state={
                  privateRoute
                    ? { previousPublicPage: location.pathname }
                    : undefined
                }
                className="transition-colors hover:text-white"
                style={({ isActive }) => ({
                  color: isActive ? "#f59e0b" : "#8892a4",
                })}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div
          className="flex items-center gap-4"
          style={{ color: "#8892a4" }}
        >
          <ShoppingBag
            size={18}
            className="cursor-pointer hover:text-white transition-colors"
          />

          {user ? (
            <>
              <NavLink
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "#2d3548" }}
                >
                  <User size={15} />
                </div>

                <span
                  className="hidden lg:block text-[12px]"
                  style={{ color: "#c4c8d8" }}
                >
                  {user.name}
                </span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-[12px] px-3 py-1.5 rounded hover:opacity-80"
                style={{
                  background: "#1e2433",
                  color: "#8892a4",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                navigate("/login", {
                  state: {
                    from: location.pathname,
                    cancelTo: location.pathname,
                  },
                })
              }
              className="text-[12px] px-4 py-2 rounded font-semibold hover:opacity-90"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}