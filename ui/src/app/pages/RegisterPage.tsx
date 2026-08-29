import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
  Check,
  Disc3,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { registerUser } from "../services/userService";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const registerState = location.state as
    | { from?: string; cancelTo?: string }
    | null;

  const from = registerState?.from || "/";
  const cancelTo = registerState?.cancelTo || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRules = useMemo(
    () => ({
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    if (!name.trim()) {
      setError("Ingresa tu nombre.");
      return;
    }

    if (!passwordValid) {
      setError("La contraseña no cumple con todos los requisitos.");
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const createdUser = await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      login(createdUser);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError(
        "No se pudo crear la cuenta. Verifica que el correo no esté registrado."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", { state: { from, cancelTo } });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{ background: "#0f1117", color: "#e8eaf0" }}
    >
      <div className="w-full max-w-[460px]">
        <NavLink to="/" className="flex items-center justify-center gap-2 mb-6">
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
            <h1 className="text-2xl font-bold mb-2">Crear cuenta</h1>
            <p className="text-[13px]" style={{ color: "#8892a4" }}>
              Únete a Music Market para publicar y administrar tu colección.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Field icon={<User size={16} />} label="Nombre">
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                required
                autoFocus
                autoComplete="name"
                placeholder="Tu nombre"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "#e8eaf0" }}
              />
            </Field>

            <Field icon={<Mail size={16} />} label="Correo electrónico" top>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                autoComplete="email"
                placeholder="correo@ejemplo.com"
                className="flex-1 bg-transparent outline-none text-[13px]"
                style={{ color: "#e8eaf0" }}
              />
            </Field>

            <label className="block text-[13px] mb-2 mt-4">Contraseña</label>
            <PasswordInput
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError("");
              }}
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
              placeholder="Crea una contraseña"
            />

            <div
              className="mt-3 rounded p-3 space-y-1.5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <PasswordRule valid={passwordRules.minLength} label="Mínimo 8 caracteres" />
              <PasswordRule valid={passwordRules.uppercase} label="Una letra mayúscula" />
              <PasswordRule valid={passwordRules.lowercase} label="Una letra minúscula" />
              <PasswordRule valid={passwordRules.number} label="Un número" />
              <PasswordRule valid={passwordRules.special} label="Un carácter especial" />
            </div>

            <label className="block text-[13px] mb-2 mt-4">Confirmar contraseña</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(value) => {
                setConfirmPassword(value);
                setError("");
              }}
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
              placeholder="Repite tu contraseña"
              border={
                confirmPassword
                  ? passwordsMatch
                    ? "1px solid rgba(34,197,94,0.35)"
                    : "1px solid rgba(239,68,68,0.35)"
                  : undefined
              }
            />

            {confirmPassword && !passwordsMatch && (
              <p className="text-[11px] mt-2" style={{ color: "#ef4444" }}>
                Las contraseñas no coinciden.
              </p>
            )}

            {error && (
              <div
                className="mt-4 text-[12px] px-3 py-2.5 rounded"
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
                disabled={loading || !passwordValid || !passwordsMatch}
                className="flex-1 py-2.5 rounded text-[13px] font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "#f59e0b", color: "#0f1117" }}
              >
                <UserPlus size={15} />
                {loading ? "Creando..." : "Crear cuenta"}
              </button>
            </div>
          </form>

          <p className="text-center text-[12px] mt-6" style={{ color: "#8892a4" }}>
            ¿Ya tienes una cuenta?{" "}
            <button type="button" onClick={handleLogin} style={{ color: "#f59e0b" }}>
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
  top = false,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  top?: boolean;
}) {
  return (
    <>
      <label className={`block text-[13px] mb-2 ${top ? "mt-4" : ""}`}>{label}</label>
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded"
        style={{
          background: "#1e2433",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ color: "#6f7890" }}>{icon}</span>
        {children}
      </div>
    </>
  );
}

function PasswordInput({
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  border,
}: {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  border?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded"
      style={{
        background: "#1e2433",
        border: border || "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Lock size={16} style={{ color: "#6f7890" }} />
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete="new-password"
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[13px]"
        style={{ color: "#e8eaf0" }}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        style={{ color: "#6f7890" }}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function PasswordRule({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div
      className="flex items-center gap-2 text-[11px]"
      style={{ color: valid ? "#22c55e" : "#6f7890" }}
    >
      {valid ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );
}
