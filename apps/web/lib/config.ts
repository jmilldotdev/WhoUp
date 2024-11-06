export type AuthMethods = "email" | "google" | "apple";

export interface AppConfig {
  authMethods: AuthMethods[];
}

const devConfig: AppConfig = {
  authMethods: ["email", "google"],
};

const prodConfig: AppConfig = {
  authMethods: ["google"],
};

export const CONFIG: AppConfig =
  process.env.NODE_ENV === "production" ? prodConfig : devConfig;
