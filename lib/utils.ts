import { API_URL } from "@/config-global";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { STORAGE_KEY } from "./contanst";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

enum SIZE_ENUM {
  THUMBNAIL = 100,
  MEDIUM = 250,
  LARGE = 400,
  ULTRA = 800,
}
export const convertIDToURL = (id: string, size: SIZE_ENUM = 400) => {
  if (!id) return "";
  return `${API_URL}/files/${id}-${size}.avif`;
};

export const convertURLToID = (url: string): string | null => {
  const parts = url.split("/"); // Tách lấy phần cuối
  const fileName = parts.pop();

  if (!fileName) return null;

  return fileName.slice(0, -9);
};

export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
