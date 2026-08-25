import { Navigate } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    user.role !== "ADMIN" &&
    user.role !== "SUPER_ADMIN"
 ) {
    return <Navigate to="/" replace />;
 }

  return <>{children}</>;
}