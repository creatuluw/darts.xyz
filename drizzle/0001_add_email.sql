-- Migration: Add email column to players table
-- This migration associates all player data with an email address

-- Step 1: Add email column (temporarily nullable to allow migration)
ALTER TABLE "darts"."players" ADD COLUMN "email" varchar(255);

-- Step 2: Create index on email for faster lookups
CREATE INDEX "idx_players_email" ON "darts"."players" USING btree ("email");

-- Step 3: Drop the unique constraint on name (we removed it in schema)
ALTER TABLE "darts"."players" DROP CONSTRAINT IF EXISTS "players_name_unique";

-- Step 4: Make name NOT NULL (was previously not null due to unique constraint)
ALTER TABLE "darts"."players" ALTER COLUMN "name" SET NOT NULL;

-- Step 5: Add unique constraint on email (must be done after data exists)
ALTER TABLE "darts"."players" ADD CONSTRAINT "players_email_unique" UNIQUE("email");
