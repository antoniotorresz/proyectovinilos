import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { Mail, LogIn } from "lucide-react";
import { getUserByEmail } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const user = await getUserByEmail(email);

      login(user);

      navigate("/explore");
    } catch (err) {
      console.error(err);
      setError("No se encontró un usuario con ese correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{
        background: "#0f1117",
        color: "#e8eaf0",
      }}
    >
      <div
        className="w-full max-w-[420px] rounded-lg p-7"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-2">
            Iniciar sesión
          </h1>

          <p
            className="text-[13px]"
            style={{ color: "#8892a4" }}
          >
            Ingresa tu correo para acceder a Music Market.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block text-[13px] mb-2">
            Correo electrónico
          </label>

          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded"
            style={{
              background: "#1e2433",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Mail
              size={16}
              style={{ color: "#6f7890" }}
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
              className="flex-1 bg-transparent outline-none text-[13px]"
              style={{ color: "#e8eaf0" }}
            />
          </div>

          {error && (
            <p
              className="mt-3 text-[12px]"
              style={{ color: "#ef4444" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              background: "#f59e0b",
              color: "#0f1117",
            }}
          >
            <LogIn size={15} />

            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}