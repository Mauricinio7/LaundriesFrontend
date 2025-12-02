import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../features/Login/AuthProvider";
import { PAGE_PATH } from "./pages.paths";
import { LoaderFallback } from "../../shared/ui/LoaderFallback";

type RequireAuthProps = {
  children: ReactNode;
};

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <LoaderFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PAGE_PATH.login} replace state={{ from: location }} />;
  }

  return <>{children}</>;
};
