import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PAGE_PATH } from "./pages.paths";
import { LoaderFallback } from "../../shared/ui/LoaderFallback";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

const App = lazy(() => import("../App"));
const LoginPage = lazy(() => import("../../pages/LoginPage"));
const HomeEmployeePage = lazy(() => import("../../pages/HomeEmployeePage"));
const RoleBasedHomePage = lazy(() => import("./RoleBasedHomePage"));
const OrdersPage = lazy(() => import("../../pages/OrdersPage"));
const CustomersPage = lazy(() => import("../../pages/CustomersPage"));
const CashPage = lazy(() => import("../../pages/CashPage"));

const Fallback = <p style={{ padding: 16 }}>Cargando…</p>;

const routes: RouteObject[] = [
  {
    path: PAGE_PATH.login,
    element: (
      <Suspense fallback={Fallback}>
        <LoginPage />
      </Suspense>
    ),
  },

  {
    element: (
      <RequireAuth>
        <Suspense fallback={<LoaderFallback />}>
          <App />
        </Suspense>
      </RequireAuth>
    ),
    children: [
      {
        path: PAGE_PATH.main,
        element: (
          <Suspense fallback={Fallback}>
            <RoleBasedHomePage />
          </Suspense>
        ),
      },
      {
        path: PAGE_PATH.homeEmployee,
        element: (
          <Suspense fallback={Fallback}>
            <HomeEmployeePage />
          </Suspense>
        ),
      },
      {
        path: PAGE_PATH.orders,
        element: (
          <RequireRole allowedRoles={["EMPLOYEE"]}>
            <Suspense fallback={Fallback}>
              <OrdersPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.customers,
        element: (
          <RequireRole allowedRoles={["EMPLOYEE"]}>
            <Suspense fallback={Fallback}>
              <CustomersPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.cash,
        element: (
          <RequireRole allowedRoles={["EMPLOYEE"]}>
            <Suspense fallback={Fallback}>
              <CashPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={Fallback}>
            <RoleBasedHomePage />
          </Suspense>
        ),
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
