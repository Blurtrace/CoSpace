import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "./entities/User";
import { RefreshToken } from "./entities/RefreshToken";
import { Space } from "./entities/Space";
import { Reservation } from "./entities/Reservation";
import { InitialSchema1710000000000 } from "./migrations/1710000000000-InitialSchema";

// Carga variables de entorno para ejecuciones CLI y scripts fuera de Next.js
config();

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL ?? "";
const isSupabase = databaseUrl.includes("supabase.com") || databaseUrl.includes("supabase.co");

export const AppDataSource = new DataSource({
  type: "postgres",
  url: databaseUrl,
  ssl: isProduction || isSupabase ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: !isProduction,
  entities: [User, RefreshToken, Space, Reservation],
  migrations: [InitialSchema1710000000000],
  subscribers: [],
  extra: {
    max: 2,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
  },
});

declare global {
  // eslint-disable-next-line no-var
  var __typeormDataSource: DataSource | undefined;
  // eslint-disable-next-line no-var
  var __typeormInitPromise: Promise<DataSource> | undefined;
}

export async function getDataSource(): Promise<DataSource> {
  if (!process.env.DATABASE_URL) {
    throw new Error("La variable de entorno DATABASE_URL no está definida.");
  }

  const globalRef = globalThis as typeof globalThis & {
    __typeormDataSource?: DataSource;
    __typeormInitPromise?: Promise<DataSource>;
  };

  if (globalRef.__typeormDataSource?.isInitialized) {
    return globalRef.__typeormDataSource;
  }

  if (globalRef.__typeormInitPromise) {
    return globalRef.__typeormInitPromise;
  }

  const dataSource = globalRef.__typeormDataSource ?? AppDataSource;
  globalRef.__typeormDataSource = dataSource;

  globalRef.__typeormInitPromise = (async () => {
    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      return dataSource;
    } finally {
      globalRef.__typeormInitPromise = undefined;
    }
  })();

  return globalRef.__typeormInitPromise;
}
