import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateJobsTable1700000000000 implements MigrationInterface {
  name = 'CreateJobsTable1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ✅ FIX: Habilitar extensión ANTES de crear la tabla
    // uuid_generate_v4() se usa como default en la columna id
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create ENUMs
    await queryRunner.query(`
      CREATE TYPE "job_type_enum" AS ENUM (
        'full_time', 'part_time', 'contract', 'freelance', 'internship'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "job_experience_level_enum" AS ENUM (
        'junior', 'mid', 'senior', 'lead', 'manager'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "job_status_enum" AS ENUM (
        'active', 'paused', 'closed', 'draft'
      )
    `);

    // Create jobs table
    await queryRunner.createTable(
      new Table({
        name: 'jobs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'company',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'company_logo_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'is_remote',
            type: 'boolean',
            default: false,
          },
          {
            name: 'job_type',
            type: 'job_type_enum',
            default: "'full_time'",
          },
          {
            name: 'experience_level',
            type: 'job_experience_level_enum',
            default: "'mid'",
          },
          {
            name: 'salary_min',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'salary_max',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'salary_currency',
            type: 'varchar',
            length: '10',
            default: "'USD'",
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'requirements',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'benefits',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'tags',
            type: 'varchar',
            isArray: true,
            default: 'ARRAY[]::varchar[]',
          },
          {
            name: 'status',
            type: 'job_status_enum',
            default: "'active'",
          },
          {
            name: 'apply_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'published_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    // Indexes
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({ name: 'IDX_jobs_status', columnNames: ['status'] }),
    );
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({ name: 'IDX_jobs_job_type', columnNames: ['job_type'] }),
    );
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_jobs_experience_level',
        columnNames: ['experience_level'],
      }),
    );
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_jobs_published_at',
        columnNames: ['published_at'],
      }),
    );
    await queryRunner.createIndex(
      'jobs',
      new TableIndex({
        name: 'IDX_jobs_is_remote',
        columnNames: ['is_remote'],
      }),
    );

    // Full-text search index
    await queryRunner.query(`
      CREATE INDEX IDX_jobs_fulltext
      ON jobs
      USING gin(to_tsvector('english', title || ' ' || company || ' ' || description))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('jobs');
    await queryRunner.query(`DROP TYPE IF EXISTS "job_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "job_experience_level_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "job_status_enum"`);
  }
}