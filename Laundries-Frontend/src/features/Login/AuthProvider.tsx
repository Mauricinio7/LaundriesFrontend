import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type User = {
  id: string;
  email: string;
  role: string;
};

export type EmployeeProfile = {
  idEmpleado: string;
  nombre: string;
  direccion: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  idSucursal: string;
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  profile: EmployeeProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "laundries:auth";

type StoredAuth = {
  user: User;
  accessToken: string;
  refreshToken: string;
  profile: EmployeeProfile | null;
};

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://100.68.70.25:5500";
const EMPLOYEES_API_BASE_URL =
  import.meta.env.VITE_EMPLOYEES_API_URL ?? "http://100.68.70.25:8882";

const LOGIN_TIMEOUT_MS = 8000;
const PROFILE_TIMEOUT_MS = 8000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredAuth;
        setUser(parsed.user);
        setAccessToken(parsed.accessToken);
        setRefreshToken(parsed.refreshToken);
        setProfile(parsed.profile ?? null);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const persistAuth = (data: StoredAuth) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setProfile(data.profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const login = async (email: string, password: string) => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, LOGIN_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("LOGIN_FAILED");
      }

      const json = (await res.json()) as {
        success: boolean;
        data: {
          id: string;
          email: string;
          role: string;
          accessToken: string;
          refreshToken: string;
        };
      };

      if (!json.success) {
        throw new Error("LOGIN_FAILED");
      }

      const user: User = {
        id: json.data.id,
        email: json.data.email,
        role: json.data.role,
      };

      const token = json.data.accessToken;

      const profileController = new AbortController();
      const profileTimeoutId = window.setTimeout(() => {
        profileController.abort();
      }, PROFILE_TIMEOUT_MS);

      let profile: EmployeeProfile;

      try {
        const profileRes = await fetch(
          `${EMPLOYEES_API_BASE_URL}/employees/${user.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: profileController.signal,
          }
        );

        if (!profileRes.ok) {
          throw new Error("PROFILE_FAILED");
        }

        profile = (await profileRes.json()) as EmployeeProfile;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          throw new Error("PROFILE_TIMEOUT");
        }
        throw new Error("PROFILE_FAILED");
      } finally {
        clearTimeout(profileTimeoutId);
      }

      persistAuth({
        user,
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
        profile,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("LOGIN_TIMEOUT");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isAuthenticated = Boolean(accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        profile,
        isAuthenticated,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
