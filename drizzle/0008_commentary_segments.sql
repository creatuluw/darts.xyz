-- 4-segment commentary: spectator interview + commentator analysis & outlook
ALTER TABLE "darts"."commentary"
	ADD COLUMN IF NOT EXISTS "analysis" text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS "outlook" text NOT NULL DEFAULT '',
	ADD COLUMN IF NOT EXISTS "analyst_voice" varchar(64),
	ADD COLUMN IF NOT EXISTS "audio_analysis" text,
	ADD COLUMN IF NOT EXISTS "audio_outlook" text;
