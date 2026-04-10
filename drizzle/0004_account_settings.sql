-- Migration: Add account_settings table for SMTP configuration

CREATE TABLE IF NOT EXISTS "darts"."account_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" varchar(255) NOT NULL,
  "smtp_host" varchar(255),
  "smtp_port" integer,
  "smtp_user" varchar(255),
  "smtp_password" varchar(255),
  "smtp_from" varchar(255),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_account_settings_account" ON "darts"."account_settings" USING btree ("account_id");
