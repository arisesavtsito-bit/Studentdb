import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    throw new Error(`Variable d'environnement manquante : ${key}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 3000),
  dbHost: requireEnv("DB_HOST"),
  dbPort: Number(process.env.DB_PORT || 5432),
  dbUser: requireEnv("DB_USER"),
  dbPassword: requireEnv("DB_PASSWORD"),
  dbName: requireEnv("DB_NAME"),
  jwtSecret: requireEnv("JWT_SECRET")
} as const;
