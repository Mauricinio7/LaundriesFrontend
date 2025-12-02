import { Outlet } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";
import style from "../shared/styles/AppLayout.module.css";
import PillLink from "../shared/ui/PillLink";
import { useAuth } from "../features/Login/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(PAGE_PATH.login, { replace: true });
  };

  return (
    <div className={style.app}>
      <div className={style.frame}>
        <header className={style.header}>
          <div className={style.headerRow}>
            <div className={style.leftGroup}>
              <PillLink to={PAGE_PATH.main}>Menú principal</PillLink>
            </div>

            <div className={style.leftGroup}>
              <PillLink to={PAGE_PATH.second}>Ir a la página 2</PillLink>
            </div>
            <div
              className={style.rightGroup}
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                {user?.email}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 12px",
                  background: "#e23f3f",
                  borderRadius: "12px",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "13px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </header>

        <main className={style.main}>
          <div className={style.contentCard}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
