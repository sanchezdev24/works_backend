/**
 * DataSource for TypeORM CLI (migrations).
 * Used by: npm run migration:run / migration:generate / migration:revert
 */
import 'reflect-metadata';
import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// ✅ FIX: Cargar .env.development primero, con fallback a .env
// dotenv no sobreescribe variables ya definidas, por eso el orden importa
dotenv.config({ path: '.env.development' });
dotenv.config({ path: '.env' });

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'jobs_db',
  entities: [
    __dirname + '/../../../features/**/infrastructure/persistence/orm-entities/*.orm-entity{.ts,.js}',
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_history',
  synchronize: false,
  logging: true,
});