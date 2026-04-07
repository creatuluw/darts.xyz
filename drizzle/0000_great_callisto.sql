CREATE TABLE "darts"."legs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"leg_number" integer NOT NULL,
	"winner_id" uuid,
	"first_thrower_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "darts"."match_players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"throw_order" integer NOT NULL,
	"sets_won" integer DEFAULT 0 NOT NULL,
	"legs_won" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "darts"."matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" varchar(20) DEFAULT 'in_progress' NOT NULL,
	"starting_score" integer DEFAULT 501 NOT NULL,
	"legs_per_set" integer DEFAULT 3 NOT NULL,
	"sets_per_match" integer DEFAULT 1 NOT NULL,
	"double_in" boolean DEFAULT false NOT NULL,
	"winner_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_matches_status" CHECK ("darts"."matches"."status" IN ('in_progress', 'completed', 'abandoned'))
);
--> statement-breakpoint
CREATE TABLE "darts"."player_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"matches_played" integer DEFAULT 0 NOT NULL,
	"matches_won" integer DEFAULT 0 NOT NULL,
	"sets_played" integer DEFAULT 0 NOT NULL,
	"sets_won" integer DEFAULT 0 NOT NULL,
	"legs_played" integer DEFAULT 0 NOT NULL,
	"legs_won" integer DEFAULT 0 NOT NULL,
	"total_darts_thrown" integer DEFAULT 0 NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"three_dart_avg" numeric(6, 2) DEFAULT '0' NOT NULL,
	"checkout_attempts" integer DEFAULT 0 NOT NULL,
	"checkout_successes" integer DEFAULT 0 NOT NULL,
	"checkout_pct" numeric(5, 2) DEFAULT '0' NOT NULL,
	"total_180s" integer DEFAULT 0 NOT NULL,
	"total_140s" integer DEFAULT 0 NOT NULL,
	"total_100s" integer DEFAULT 0 NOT NULL,
	"highest_finish" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_stats_player_id_unique" UNIQUE("player_id")
);
--> statement-breakpoint
CREATE TABLE "darts"."players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "players_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "darts"."turns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"leg_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"turn_number" integer NOT NULL,
	"dart1_score" smallint NOT NULL,
	"dart1_multiplier" smallint NOT NULL,
	"dart1_segment" smallint NOT NULL,
	"dart2_score" smallint NOT NULL,
	"dart2_multiplier" smallint NOT NULL,
	"dart2_segment" smallint NOT NULL,
	"dart3_score" smallint NOT NULL,
	"dart3_multiplier" smallint NOT NULL,
	"dart3_segment" smallint NOT NULL,
	"total_score" integer NOT NULL,
	"remaining_score" integer NOT NULL,
	"is_bust" boolean DEFAULT false NOT NULL,
	"darts_thrown" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_multiplier1" CHECK ("darts"."turns"."dart1_multiplier" IN (0,1,2,3)),
	CONSTRAINT "chk_multiplier2" CHECK ("darts"."turns"."dart2_multiplier" IN (0,1,2,3)),
	CONSTRAINT "chk_multiplier3" CHECK ("darts"."turns"."dart3_multiplier" IN (0,1,2,3)),
	CONSTRAINT "chk_darts_thrown" CHECK ("darts"."turns"."darts_thrown" BETWEEN 1 AND 3)
);
--> statement-breakpoint
ALTER TABLE "darts"."legs" ADD CONSTRAINT "legs_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "darts"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."legs" ADD CONSTRAINT "legs_winner_id_players_id_fk" FOREIGN KEY ("winner_id") REFERENCES "darts"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."legs" ADD CONSTRAINT "legs_first_thrower_id_match_players_id_fk" FOREIGN KEY ("first_thrower_id") REFERENCES "darts"."match_players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."match_players" ADD CONSTRAINT "match_players_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "darts"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."match_players" ADD CONSTRAINT "match_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "darts"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."player_stats" ADD CONSTRAINT "player_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "darts"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."turns" ADD CONSTRAINT "turns_leg_id_legs_id_fk" FOREIGN KEY ("leg_id") REFERENCES "darts"."legs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "darts"."turns" ADD CONSTRAINT "turns_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "darts"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_legs_match" ON "darts"."legs" USING btree ("match_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_leg" ON "darts"."legs" USING btree ("match_id","set_number","leg_number");--> statement-breakpoint
CREATE INDEX "idx_match_players_match" ON "darts"."match_players" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "idx_match_players_player" ON "darts"."match_players" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_match_player" ON "darts"."match_players" USING btree ("match_id","player_id");--> statement-breakpoint
CREATE INDEX "idx_matches_status" ON "darts"."matches" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_matches_winner" ON "darts"."matches" USING btree ("winner_id");--> statement-breakpoint
CREATE INDEX "idx_matches_created" ON "darts"."matches" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_player_stats_player" ON "darts"."player_stats" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "idx_players_name_lower" ON "darts"."players" USING btree (LOWER("name"));--> statement-breakpoint
CREATE INDEX "idx_turns_leg" ON "darts"."turns" USING btree ("leg_id");--> statement-breakpoint
CREATE INDEX "idx_turns_player" ON "darts"."turns" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "idx_turns_player_created" ON "darts"."turns" USING btree ("player_id","created_at");