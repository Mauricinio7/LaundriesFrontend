import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/Login/AuthProvider";
import { PAGE_PATH } from "./pages.paths";

export default function RoleBasedHomePage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={PAGE_PATH.login} replace />;
  }

  switch (user.role) {
    case "EMPLOYEE":
      return <Navigate to={PAGE_PATH.homeEmployee} replace />;
    case "MANAGER":
      return <Navigate to={PAGE_PATH.homeManager} replace />;
    case "ADMIN":
      return <Navigate to={PAGE_PATH.homeAdmin} replace />;

    default:
      return <Navigate to={PAGE_PATH.homeEmployee} replace />;
  }
}
