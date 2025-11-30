import { Outlet } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";
import style from "../shared/styles/AppLayout.module.css";
import PillLink from "../shared/ui/PillLink";

export default function App() {
  return (
    <div className={style.app}>
      <div className={style.frame}>
        <header className={style.header}>
          <div className={style.headerRow}>
            <div className={style.leftGroup}>
              <PillLink to={PAGE_PATH.main} aria-label="Ir al menú principal">
                Menu principal
              </PillLink>
            </div>

            <div className={style.leftGroup}>
              <PillLink to={PAGE_PATH.second} aria-label="Ir a la página 2">
                Ir a la página 2
              </PillLink>
            </div>

            <div />
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
