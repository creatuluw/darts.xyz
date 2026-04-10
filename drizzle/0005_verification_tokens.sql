-- Migration: Add verification_tokens table for email verification flow
-- Stores tokens that are emailed to players to verify their email address.

CREATE TABLE IF NOT EXISTS "darts"."verification_tokens" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "player_id" uuid NOT NULL REFERENCES "darts"."players"("id") ON DELETE CASCADE,
  "token" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL,
  "used_at" timestamp with time zone,
  "expires_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_verification_tokens_token" ON "darts"."verification_tokens" USING btree ("token");
CREATE INDEX IF NOT EXISTS "idx_verification_tokens_player" ON "darts"."verification_tokens" USING btree ("player_id");
CREATE INDEX IF NOT EXISTS "idx_verification_tokens_email" ON "darts"."verification_tokens" USING btree ("email");
