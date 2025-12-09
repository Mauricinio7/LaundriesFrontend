import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { PAGE_PATH } from "./routeManager/pages.paths";
import style from "../shared/styles/AppLayout.module.css";
import { useAuth } from "../features/Login/AuthProvider";

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5a.5.5 0 0 1-.5-.5V15H10v5.5a.5.5 0 0 1-.5.5H5a1 1 0 0 1-1-1v-8.5Z"
      className="stroke-sky-600"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OrdersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="4"
      y="3.5"
      width="16"
      height="17"
      rx="2"
      className="stroke-sky-600"
      strokeWidth="2"
    />
    <path
      d="M8 8h8M8 12h5M8 16h4"
      className="stroke-sky-500"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const CustomersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <circle cx="9" cy="9" r="3.2" className="stroke-sky-600" strokeWidth="2" />
    <path
      d="M4.8 18.5c.8-2.1 2.4-3.5 4.2-3.5s3.4 1.4 4.2 3.5"
      className="stroke-sky-500"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle
      cx="17"
      cy="9.5"
      r="2.3"
      className="stroke-sky-400"
      strokeWidth="1.8"
    />
    <path
      d="M14.8 17.2c.6-1.5 1.7-2.5 3.1-2.5 1.4 0 2.5 1 3.1 2.5"
      className="stroke-sky-300"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const CashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <rect
      x="3.5"
      y="6.5"
      width="17"
      height="11"
      rx="2"
      className="stroke-sky-600"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="12"
      r="2.3"
      className="stroke-sky-500"
      strokeWidth="2"
    />
    <path
      d="M7 8.5h1.8M15.2 8.5H17M7 15.5h1.8M15.2 15.5H17"
      className="stroke-sky-400"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10"
      className="stroke-sky-500"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14 8.5 18 12l-4 3.5"
      className="stroke-red-500"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 12H10"
      className="stroke-red-500"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BubblesBackground = () => (
  <svg
    viewBox="0 0 120 260"
    className="absolute inset-0 pointer-events-none opacity-40"
  >
    <circle cx="20" cy="30" r="10" fill="#e0f2fe" />
    <circle cx="45" cy="70" r="14" fill="#bae6fd" />
    <circle cx="25" cy="120" r="9" fill="#e0f2fe" />
    <circle cx="55" cy="150" r="16" fill="#bfdbfe" />
    <circle cx="30" cy="200" r="11" fill="#e0f2fe" />
    <circle cx="60" cy="230" r="13" fill="#bae6fd" />
  </svg>
);

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(PAGE_PATH.login, { replace: true });
  };

  return (
    <div className="h-screen bg-sky-50 flex w-full overflow-hidden">
      <aside
        className="relative flex flex-col bg-white/90 border-r border-sky-100 shadow-sm transition-all duration-200"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{ width: expanded ? 320 : 120 }}
      >
        <div className="relative flex flex-col h-full overflow-hidden">
          <BubblesBackground />

          <div className="relative z-10 flex items-center gap-3 px-4 pt-4 pb-6">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center">
              <span className="text-sky-600 text-2xl font-semibold">L</span>
            </div>
            <div
              className={`transition-opacity text-lg font-semibold text-slate-800 ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              Laundries Admin
            </div>
          </div>

          <nav className="relative z-10 flex-1 flex flex-col gap-2 px-3">
            <NavLink
              to={PAGE_PATH.homeEmployee}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-3 py-3 rounded-xl text-base font-semibold transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
                ].join(" ")
              }
            >
              <HomeIcon className="h-8 w-8 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Home
              </span>
            </NavLink>

            <NavLink
              to={PAGE_PATH.orders}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-3 py-3 rounded-xl text-base font-semibold transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
                ].join(" ")
              }
            >
              <OrdersIcon className="h-8 w-8 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Órdenes
              </span>
            </NavLink>

            <NavLink
              to={PAGE_PATH.customers}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-3 py-3 rounded-xl text-base font-semibold transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
                ].join(" ")
              }
            >
              <CustomersIcon className="h-8 w-8 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Clientes
              </span>
            </NavLink>

            <NavLink
              to={PAGE_PATH.cash}
              className={({ isActive }) =>
                [
                  "flex items-center gap-4 px-3 py-3 rounded-xl text-base font-semibold transition-colors",
                  isActive
                    ? "bg-sky-100 text-sky-700"
                    : "text-slate-500 hover:bg-sky-50 hover:text-sky-700",
                ].join(" ")
              }
            >
              <CashIcon className="h-8 w-8 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Caja
              </span>
            </NavLink>
          </nav>

          <div className="relative z-10 px-3 pb-4 pt-2 mt-auto">
            {user && (
              <div
                className={`mb-3 flex items-center gap-4 rounded-xl bg-sky-50/80 px-3 py-3 text-sm text-slate-600 transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="h-12 w-12 bg-sky-200 rounded-lg flex items-center justify-center text-xl font-bold text-sky-700 shadow-sm">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium truncate text-[14px]">
                    {user.email}
                  </span>
                  <span className="uppercase tracking-wide text-[11px] text-sky-600">
                    {user.role}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogoutIcon className="h-8 w-8 flex-shrink-0" />
              <span
                className={`whitespace-nowrap transition-opacity ${
                  expanded ? "opacity-100" : "opacity-0"
                }`}
              >
                Salir
              </span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-hidden">
        <div
          className={`${style.contentCard} w-full h-full bg-white/90 rounded-3xl shadow-lg shadow-sky-100 border border-sky-100 overflow-y-auto`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
