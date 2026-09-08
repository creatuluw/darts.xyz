CREATE SCHEMA IF NOT EXISTS "darts";
CREATE TABLE IF NOT EXISTS "darts"."commentary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_ref" varchar(255) NOT NULL,
	"boundary_key" varchar(320) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"persona" jsonb NOT NULL,
	"commentator_voice" varchar(64) NOT NULL,
	"spectator_voice" varchar(64) NOT NULL,
	"spectator_name" varchar(100) NOT NULL,
	"audio_question" text,
	"audio_answer" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_commentary_boundary" ON "darts"."commentary" USING btree ("boundary_key");
CREATE INDEX IF NOT EXISTS "idx_commentary_match" ON "darts"."commentary" USING btree ("match_ref");
