import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();
  const previousPublicPage =
    (location.state as { previousPublicPage?: string } | null)
        ?.previousPublicPage || "/";

  if (!user) {
    return (
        <Navigate
        to="/login"
        replace
        state={{
            from: location.pathname,
            cancelTo: previousPublicPage,
        }}
        />
    );
  }

  return <>{children}</>;
}