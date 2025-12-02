import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PAGE_PATH } from "./pages.paths";
import { LoaderFallback } from "../../shared/ui/LoaderFallback";
import { RequireAuth } from "./RequireAuth";

const App = lazy(() => import("../App"));
const MainPage = lazy(() => import("../../pages/MainPage"));
const SecondPage = lazy(() => import("../../pages/SecondPage"));
const LoginPage = lazy(() => import("../../pages/LoginPage"));

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
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: PAGE_PATH.second,
        element: (
          <Suspense fallback={Fallback}>
            <SecondPage />
          </Suspense>
        ),
      },
    ],
  },
] satisfies RouteObject[];

export const router = createBrowserRouter(routes);
