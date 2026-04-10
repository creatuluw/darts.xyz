-- Migration: Add account_id column to matches table
-- This allows filtering matches by the account (email) that created them

ALTER TABLE "darts"."matches" ADD COLUMN "account_id" varchar(255);
CREATE INDEX "idx_matches_account" ON "darts"."matches" USING btree ("account_id");
