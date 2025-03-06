"use client";

import {
  useMemo,
  useEffect,
  useReducer,
  useCallback,
  ReactNode,
  createContext,
} from "react";

import { API_URL } from "@/config-global";
import { isValidToken, setSession } from "@/lib/utils";

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at a basic level.
 * Customers will need to do some extra handling themselves if they want to extend the logic and other features...
 */
interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  login: (data: { username: string; password: string }) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
  unauthenticated: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});
interface User {
  id: string;
  email: string;
  name?: string;
  token?: string;
  [key: string]: string | number | undefined;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthAction {
  type: "INITIAL" | "LOGIN" | "REGISTER" | "LOGOUT";
  payload?: { user: User | null };
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

const reducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIAL":
      return {
        loading: false,
        user: action.payload?.user || null,
      };
    case "LOGIN":
    case "REGISTER":
      return {
        ...state,
        user: action.payload?.user || null,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = "token";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
      if (token && isValidToken(token)) {
        setSession(token);
        const userJson = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userJson.ok) {
          throw new Error("Invalid token");
        }
        const { user } = await userJson.json();
        dispatch({
          type: "INITIAL",
          payload: { user: { ...user, token } },
        });
      } else {
        dispatch({ type: "INITIAL", payload: { user: null } });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: "INITIAL", payload: { user: null } });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (data: { username: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }
      const responseJson = await response.json();
      const { token, user } = responseJson;
      if (!token) throw new Error("Server did not return a token");
      setSession(token);
      dispatch({ type: "LOGIN", payload: { user: { ...user, token } } });
    },
    []
  );

  // REGISTER

  const register = useCallback(async (data: RegisterData) => {
    await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";
  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
