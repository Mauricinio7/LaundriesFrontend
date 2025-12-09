import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/Login/AuthProvider";
import { PAGE_PATH } from "./pages.paths";

type RequireRoleProps = {
  allowedRoles: string[];
  children: ReactNode;
};

export const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={PAGE_PATH.login} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={PAGE_PATH.main} replace />;
  }

  return <>{children}</>;
};
