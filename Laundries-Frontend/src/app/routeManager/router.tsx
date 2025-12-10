import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PAGE_PATH } from "./pages.paths";
import { LoaderFallback } from "../../shared/ui/LoaderFallback";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";
import { useAuth } from "../../features/Login/AuthProvider";

const EmployeeLayout = lazy(() => import("../LayoutEmployee"));
const ManagerLayout = lazy(() => import("../LayoutManager"));
const AdminLayout = lazy(() => import("../LayoutAdmin"));

const LoginPage = lazy(() => import("../../pages/LoginPage"));
const HomeEmployeePage = lazy(() => import("../../pages/HomeEmployeePage"));
const RoleBasedHomePage = lazy(() => import("./RoleBasedHomePage"));
const OrdersPage = lazy(() => import("../../pages/OrdersPage"));
const CustomersPage = lazy(() => import("../../pages/CustomersPage"));
const CashPage = lazy(() => import("../../pages/CashPage"));
const HomeManagerPage = lazy(() => import("../../pages/HomeManagerPage"));
const GlobalOrdersPage = lazy(() => import("../../pages/GlobalOrdersPage"));
const EmployeeManagementPage = lazy(
  () => import("../../pages/EmployeeManagmentPage")
);
const ManagerReportsPage = lazy(() => import("../../pages/ManagerReportsPage"));
const HomeAdminPage = lazy(() => import("../../pages/HomeAdminPage"));
const AdminReportsPage = lazy(() => import("../../pages/AdminReportsPage"));
const BranchesPage = lazy(() => import("../../pages/BranchesPage"));
const ServicesPage = lazy(() => import ("../../pages/ServicesPage"))

const Fallback = <p style={{ padding: 16 }}>Cargando…</p>;

function RoleBasedLayout() {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return <LoaderFallback />;
  }

  if (!user) {
    return <LoaderFallback />;
  }

  switch (user.role) {
    case "EMPLOYEE":
      return <EmployeeLayout />;

    case "MANAGER":
      return <ManagerLayout />;

    case "ADMIN":
      return <AdminLayout />;

    default:
      return <EmployeeLayout />;
  }
}

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
          <RoleBasedLayout />
        </Suspense>
      </RequireAuth>
    ),
    children: [
      {
        path: PAGE_PATH.homeEmployee,
        element: (
          <RequireRole allowedRoles={["EMPLOYEE"]}>
            <Suspense fallback={Fallback}>
              <HomeEmployeePage />
            </Suspense>
          </RequireRole>
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
        path: PAGE_PATH.homeManager,
        element: (
          <RequireRole allowedRoles={["MANAGER"]}>
            <Suspense fallback={Fallback}>
              <HomeManagerPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.globalOrders,
        element: (
          <RequireRole allowedRoles={["MANAGER"]}>
            <Suspense fallback={Fallback}>
              <GlobalOrdersPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.employeeManagment,
        element: (
          <RequireRole allowedRoles={["MANAGER"]}>
            <Suspense fallback={Fallback}>
              <EmployeeManagementPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.managerReports,
        element: (
          <RequireRole allowedRoles={["MANAGER"]}>
            <Suspense fallback={Fallback}>
              <ManagerReportsPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.homeAdmin,
        element: (
          <RequireRole allowedRoles={["ADMIN"]}>
            <Suspense fallback={Fallback}>
              <HomeAdminPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.branches,
        element: (
          <RequireRole allowedRoles={["ADMIN"]}>
            <Suspense fallback={Fallback}>
              <BranchesPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.adminReports,
        element: (
          <RequireRole allowedRoles={["ADMIN"]}>
            <Suspense fallback={Fallback}>
              <AdminReportsPage />
            </Suspense>
          </RequireRole>
        ),
      },
      {
        path: PAGE_PATH.adminServices,
        element: (
          <RequireRole allowedRoles={["ADMIN"]}>
            <Suspense fallback={Fallback}>
              <ServicesPage />
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
