import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { User as UserIcon, Mail, Calendar } from "lucide-react";
import {
  getUserById,
  updateUser,
} from "../services/userService";
import type { User } from "../services/userService";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserById(1);

        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateUser(user.id, {
        ...user,
        name,
        email,
      });

      setUser(updated);
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#8892a4" }}>
          Cargando perfil...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#ef4444" }}>
          {error || "Usuario no encontrado."}
        </p>
      </div>
    );
  }

  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
  };

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-bold mb-2">
          Mi perfil
        </h1>

        <p style={{ color: "#8892a4" }}>
          Administra la información de tu cuenta.
        </p>
      </div>

      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div
          className="p-6 flex items-center gap-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "#232a3a",
              color: "#f59e0b",
            }}
          >
            <UserIcon size={28} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {user.name}
            </h2>

            <p
              className="text-[13px]"
              style={{ color: "#8892a4" }}
            >
              Usuario de Music Market
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-[13px] mb-2">
                Nombre
              </label>

              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={inputStyle}
              >
                <UserIcon size={15} style={{ color: "#6f7890" }} />

                <input
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-2">
                Correo electrónico
              </label>

              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={inputStyle}
              >
                <Mail size={15} style={{ color: "#6f7890" }} />

                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-2">
                Miembro desde
              </label>

              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={{
                  ...inputStyle,
                  color: "#8892a4",
                }}
              >
                <Calendar size={15} />

                {user.createdAt || "No disponible"}
              </div>
            </div>
          </div>

          {error && (
            <p
              className="mt-5 text-[13px]"
              style={{ color: "#ef4444" }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              className="mt-5 text-[13px]"
              style={{ color: "#22c55e" }}
            >
              {success}
            </p>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded text-[13px] font-semibold disabled:opacity-50"
              style={{
                background: "#f59e0b",
                color: "#0f1117",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}