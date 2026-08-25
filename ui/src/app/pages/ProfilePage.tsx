import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Calendar,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";

import { changePassword, updateUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setLoading(false);
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateUser(user.id, {
        ...user,
        name: name.trim(),
        email: email.trim(),
      });

      login(updated);
      setName(updated.name || "");
      setEmail(updated.email || "");
      setSuccess("Perfil actualizado correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  const resetPasswordForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const closePasswordForm = () => {
    resetPasswordForm();
    setShowPasswordForm(false);
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError(
        "La nueva contraseña debe tener al menos 8 caracteres."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError(
        "La nueva contraseña debe ser diferente a la actual."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      await changePassword(user.id, {
        currentPassword,
        newPassword,
      });

      resetPasswordForm();
      setShowPasswordForm(false);
      setPasswordSuccess("Contraseña actualizada correctamente.");
    } catch (err) {
      console.error(err);
      setPasswordError(
        "No se pudo cambiar la contraseña. Verifica tu contraseña actual."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
        <p style={{ color: "#8892a4" }}>Cargando perfil...</p>
      </div>
    );
  }

  if (!user) return null;

  const inputStyle = {
    background: "#1e2433",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#e8eaf0",
  };

  const roleLabel =
    user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : user.role;

  return (
    <div className="flex-1 max-w-[900px] mx-auto w-full px-5 py-10">
      <div className="mb-7">
        <h1 className="text-2xl font-bold mb-2">Mi perfil</h1>
        <p style={{ color: "#8892a4" }}>
          Administra la información y seguridad de tu cuenta.
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
          className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#232a3a", color: "#f59e0b" }}
            >
              <UserIcon size={28} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-[13px]" style={{ color: "#8892a4" }}>
                Usuario de Music Market
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background:
                  user.role === "SUPER_ADMIN" || user.role === "ADMIN"
                    ? "rgba(245,158,11,0.1)"
                    : "#1e2433",
                color:
                  user.role === "SUPER_ADMIN" || user.role === "ADMIN"
                    ? "#f59e0b"
                    : "#c4c8d8",
                border:
                  user.role === "SUPER_ADMIN" || user.role === "ADMIN"
                    ? "1px solid rgba(245,158,11,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <ShieldCheck size={13} />
              {roleLabel}
            </span>

            <span
              className="inline-flex items-center text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: "#1e2433",
                color: "#8892a4",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {user.provider}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] mb-2">Nombre</label>
              <div className="flex items-center gap-2 rounded px-3 py-2" style={inputStyle}>
                <UserIcon size={15} style={{ color: "#6f7890" }} />
                <input
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-2">Correo electrónico</label>
              <div className="flex items-center gap-2 rounded px-3 py-2" style={inputStyle}>
                <Mail size={15} style={{ color: "#6f7890" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEmail(e.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-2">Miembro desde</label>
              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={{ ...inputStyle, color: "#8892a4" }}
              >
                <Calendar size={15} />
                {user.createdAt}
              </div>
            </div>

            <div>
              <label className="block text-[13px] mb-2">Método de autenticación</label>
              <div
                className="flex items-center gap-2 rounded px-3 py-2"
                style={{ ...inputStyle, color: "#8892a4" }}
              >
                <KeyRound size={15} />
                {user.provider}
              </div>
            </div>
          </div>

          {error && (
            <div
              className="mt-5 rounded px-3 py-2.5 text-[12px]"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="mt-5 rounded px-3 py-2.5 text-[12px]"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                color: "#22c55e",
              }}
            >
              {success}
            </div>
          )}

          <div
            className="flex items-center justify-between gap-4 mt-6 pt-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[12px]" style={{ color: "#6f7890" }}>
              Rol actual: {roleLabel}
            </p>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded text-[13px] font-semibold disabled:opacity-50"
              style={{ background: "#f59e0b", color: "#0f1117" }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>

      <div
        className="rounded-lg p-6 mt-6"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-start gap-3">
          <KeyRound size={20} style={{ color: "#f59e0b" }} />

          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Seguridad de la cuenta</h3>
                <p className="text-[12px]" style={{ color: "#8892a4" }}>
                  Actualiza tu contraseña de acceso.
                </p>
              </div>

              {showPasswordForm && (
                <button
                  type="button"
                  onClick={closePasswordForm}
                  aria-label="Cerrar cambio de contraseña"
                  style={{ color: "#8892a4" }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {!showPasswordForm ? (
              <button
                type="button"
                className="mt-4 px-4 py-2 rounded text-[12px] font-semibold"
                style={{
                  background: "#1e2433",
                  color: "#c4c8d8",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onClick={() => {
                  setPasswordSuccess("");
                  setShowPasswordForm(true);
                }}
              >
                Cambiar contraseña
              </button>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
                <PasswordField
                  label="Contraseña actual"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  visible={showCurrentPassword}
                  onToggle={() => setShowCurrentPassword((prev) => !prev)}
                  autoComplete="current-password"
                />

                <PasswordField
                  label="Nueva contraseña"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword((prev) => !prev)}
                  autoComplete="new-password"
                />

                <PasswordField
                  label="Confirmar nueva contraseña"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  visible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  autoComplete="new-password"
                />

                {passwordError && (
                  <div
                    className="rounded px-3 py-2.5 text-[12px]"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#ef4444",
                    }}
                  >
                    {passwordError}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-5 py-2.5 rounded text-[12px] font-semibold disabled:opacity-50"
                    style={{ background: "#f59e0b", color: "#0f1117" }}
                  >
                    {passwordSaving ? "Actualizando..." : "Actualizar contraseña"}
                  </button>
                </div>
              </form>
            )}

            {passwordSuccess && (
              <div
                className="mt-4 rounded px-3 py-2.5 text-[12px]"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  color: "#22c55e",
                }}
              >
                {passwordSuccess}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
}) {
  return (
    <div>
      <label className="block text-[12px] mb-2">{label}</label>

      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded"
        style={{
          background: "#1e2433",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <KeyRound size={14} style={{ color: "#6f7890" }} />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          autoComplete={autoComplete}
          className="flex-1 bg-transparent outline-none text-[13px]"
          style={{ color: "#e8eaf0" }}
        />

        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          style={{ color: "#6f7890" }}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}
