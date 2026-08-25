import { useState } from "react";
import type { FormEvent } from "react";
import { Disc3, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router";

import { loginUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const loginState = location.state as
    | { from?: string; cancelTo?: string }
    | null;

  const from = loginState?.from || "/";
  const cancelTo = loginState?.cancelTo || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const loggedUser = await loginUser({
        email: email.trim(),
        password,
      });

      login(loggedUser);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register", {
      state: { from, cancelTo },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{ background: "#0f1117", color: "#e8eaf0" }}
    >
      <div className="w-full max-w-[430px]">
        <NavLink
          to="/"
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div
            className="w-9 h-9 rounded flex items-center justify-center"
            style={{ background: "#f59e0b" }}
          >
            <Disc3 size={18} color="#0f1117" />
          </div>
          <span className="font-bold tracking-wide">Music Market</span>
        </NavLink>

        <div
          className="rounded-lg p-7"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="mb-7">
            <h1 className="text-2xl font-bold mb-2">Iniciar sesión</h1>
            <p className="text-[13px]" style={{ color: "#8892a4" }}>
              Ingresa a tu cuenta para publicar y administrar productos en Music Market.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-[13px] mb-2">Correo electrónico</label>
            <div className="field">
              <Mail size={16} style={{ color: "#6f7890" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                autoFocus
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "#e8eaf0" }}
              />
            </div>

            <label className="block text-[13px] mb-2 mt-4">Contraseña</label>
            <div className="field">
              <Lock size={16} style={{ color: "#6f7890" }} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "#e8eaf0" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                style={{ color: "#6f7890" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div
                className="mt-4 px-3 py-2.5 rounded text-[12px]"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate(cancelTo, { replace: true })}
                className="flex-1 py-2.5 rounded text-[13px] font-semibold disabled:opacity-50"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "#f59e0b", color: "#0f1117" }}
              >
                <LogIn size={15} />
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>

          <div className="my-6 flex items-center gap-3" style={{ color: "#4a5568" }}>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[11px] uppercase tracking-wider">o</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <button
            type="button"
            disabled
            className="w-full py-2.5 rounded text-[13px] font-semibold disabled:opacity-50"
            style={{
              background: "#1e2433",
              color: "#8892a4",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title="Disponible próximamente"
          >
            Continuar con Google · Próximamente
          </button>

          <p className="text-center text-[12px] mt-6" style={{ color: "#8892a4" }}>
            ¿No tienes una cuenta?{" "}
            <button type="button" onClick={handleRegister} style={{ color: "#f59e0b" }}>
              Crear cuenta
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.375rem;
          background: #1e2433;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .field:focus-within {
          border-color: rgba(245,158,11,0.55);
        }
      `}</style>
    </div>
  );
}
