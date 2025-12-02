import { useLocation, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useAuth } from "../features/Login/AuthProvider";
import { PAGE_PATH } from "../app/routeManager/pages.paths";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;
  const from = state?.from?.pathname ?? PAGE_PATH.main;

  const [email, setEmail] = useState("employee@gmail.com");
  const [password, setPassword] = useState("123456");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = (err as Error).message;

      if (message === "LOGIN_TIMEOUT") {
        setErrorMsg(
          "El servidor tardó demasiado en responder. Intenta de nuevo."
        );
      } else if (message === "LOGIN_FAILED") {
        setErrorMsg("Credenciales inválidas. Verifica tu correo y contraseña.");
      } else {
        setErrorMsg("Ocurrió un error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl shadow-xl shadow-sky-100 border border-sky-100 rounded-3xl p-8">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-sky-100 flex items-center justify-center">
              <span className="text-sky-600 text-2xl font-semibold">L</span>
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Laundries Admin
            </h1>
            <p className="text-sm text-slate-500 text-center">
              Inicia sesión para gestionar la lavandería.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-shadow"
                placeholder="tucorreo@laundries.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition-shadow"
                placeholder="••••••••"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-sky-200 hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
              {isSubmitting ? "Entrando..." : "Entrar al panel"}
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-slate-400">
            Sesión activa hasta que cierres sesión manualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
