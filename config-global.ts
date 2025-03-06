import packageJson from "./package.json";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export type ConfigValue = {
  appName: string;
  appVersion: string;
  serverUrl: string;
  assetsDir: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: "Purfect",
  appVersion: packageJson.version,
  serverUrl: "",
  assetsDir: "",
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
};
