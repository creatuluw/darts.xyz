-- Migration: Replace players.email with account_id, add player_email column
-- The email column was unique (one player per email) but we need multiple players
-- per account. account_id is the account (email) that owns/created the player.
-- player_email is the player's own email for future cross-account linking.

-- Step 1: Drop the unique constraint on email
ALTER TABLE "darts"."players" DROP CONSTRAINT IF EXISTS "players_email_unique";

-- Step 2: Drop the old email index
DROP INDEX IF EXISTS "darts"."idx_players_email";

-- Step 3: Rename email column to account_id
ALTER TABLE "darts"."players" RENAME COLUMN "email" TO "account_id";

-- Step 4: Add player_email column (optional, for future cross-account linking)
ALTER TABLE "darts"."players" ADD COLUMN IF NOT EXISTS "player_email" varchar(255);

-- Step 5: Create new indexes
CREATE INDEX IF NOT EXISTS "idx_players_account" ON "darts"."players" USING btree ("account_id");
CREATE INDEX IF NOT EXISTS "idx_players_player_email" ON "darts"."players" USING btree ("player_email");
