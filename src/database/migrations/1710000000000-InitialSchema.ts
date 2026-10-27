import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1710000000000 implements MigrationInterface {
  name = "InitialSchema1710000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(150) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "uq_users_email" UNIQUE ("email"),
        CONSTRAINT "pk_users_id" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "hashedToken" VARCHAR(255) NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "isRevoked" BOOLEAN NOT NULL DEFAULT false,
        "userId" UUID NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "fk_refresh_tokens_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_refresh_tokens_hashedToken" ON "refresh_tokens" ("hashedToken");
      CREATE INDEX "idx_refresh_tokens_userId" ON "refresh_tokens" ("userId");
    `);

    await queryRunner.query(`
      CREATE TABLE "spaces" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" VARCHAR(150) NOT NULL,
        "description" TEXT,
        "type" VARCHAR(50) NOT NULL DEFAULT 'desk',
        "pricePerHour" NUMERIC(10, 2) NOT NULL,
        "capacity" INT NOT NULL DEFAULT 1,
        "imageUrl" VARCHAR(500),
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_spaces_id" PRIMARY KEY ("id"),
        CONSTRAINT "chk_spaces_price_per_hour" CHECK ("pricePerHour" > 0),
        CONSTRAINT "chk_spaces_capacity" CHECK ("capacity" > 0)
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_spaces_isActive" ON "spaces" ("isActive");
    `);

    await queryRunner.query(`
      CREATE TABLE "reservations" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "startTime" TIMESTAMPTZ NOT NULL,
        "endTime" TIMESTAMPTZ NOT NULL,
        "totalPrice" NUMERIC(10, 2) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'confirmed',
        "userId" UUID NOT NULL,
        "spaceId" UUID NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "pk_reservations_id" PRIMARY KEY ("id"),
        CONSTRAINT "chk_reservations_time" CHECK ("endTime" > "startTime"),
        CONSTRAINT "chk_reservations_total_price" CHECK ("totalPrice" >= 0),
        CONSTRAINT "fk_reservations_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_reservations_space" FOREIGN KEY ("spaceId") REFERENCES "spaces"("id") ON DELETE RESTRICT
      );
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_reservations_space_time" ON "reservations" ("spaceId", "startTime", "endTime");
      CREATE INDEX "idx_reservations_user_time" ON "reservations" ("userId", "startTime", "endTime");
      CREATE INDEX "idx_reservations_status" ON "reservations" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reservations";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "spaces";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}

