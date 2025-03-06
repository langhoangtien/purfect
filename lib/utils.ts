import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STORAGE_KEY = "jwt_token";

export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length < 2) {
      throw new Error("Invalid token!");
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(token: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded || !("exp" in decoded)) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error during token validation:", error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  setTimeout(() => {
    try {
      alert("Token expired!");
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during token expiration:", error);
      throw error;
    }
  }, timeLeft);
}

// ----------------------------------------------------------------------

export async function setSession(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(STORAGE_KEY, token);

      const decodedToken = jwtDecode(token);

      if (decodedToken && "exp" in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error("Invalid access token!");
      }
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error during set session:", error);
    throw error;
  }
}
