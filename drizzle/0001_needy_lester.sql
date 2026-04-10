ALTER TABLE "darts"."players" DROP CONSTRAINT "players_name_unique";--> statement-breakpoint
ALTER TABLE "darts"."players" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_players_email" ON "darts"."players" USING btree ("email");--> statement-breakpoint
ALTER TABLE "darts"."players" ADD CONSTRAINT "players_email_unique" UNIQUE("email");