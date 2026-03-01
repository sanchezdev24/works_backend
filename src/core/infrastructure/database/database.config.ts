import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => {
  const isProd = process.env.NODE_ENV === 'production';

  // ── Render + Neon: usa DATABASE_URL ──────────────────────────────────────
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      entities: [
        __dirname + '/../../../features/**/infrastructure/persistence/orm-entities/*.orm-entity{.ts,.js}',
      ],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN === 'true',
      migrationsTableName: 'migrations_history',
      synchronize: false,
      logging: !isProd,
      extra: { connectionTimeoutMillis: 10000, max: 5 },
    };
  }

  // ── Local con Docker: usa variables individuales ─────────────────────────
  return {
    type: 'postgres' as const,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'jobs_db',
    ssl: false,
    entities: [
      __dirname + '/../../../features/**/infrastructure/persistence/orm-entities/*.orm-entity{.ts,.js}',
    ],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    migrationsRun: false,
    migrationsTableName: 'migrations_history',
    synchronize: false,
    logging: true,
  };
});