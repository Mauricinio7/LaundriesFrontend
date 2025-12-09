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

    // cuando tengas más roles los vas agregando aquí:
    // case "MANAGER":
    //   return <Navigate to={PAGE_PATH.homeManager} replace />;

    default:
      // por si llega un rol raro
      return <Navigate to={PAGE_PATH.homeEmployee} replace />;
  }
}
