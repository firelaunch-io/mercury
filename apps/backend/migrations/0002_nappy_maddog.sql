DO $$ BEGIN
 CREATE TYPE "public"."process_status" AS ENUM('pending', 'processed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "processed_transactions" (
	"transaction_id" varchar(88) PRIMARY KEY NOT NULL,
	"program_id" varchar(44) NOT NULL,
	"transaction_type" text NOT NULL,
	"starship_version" varchar(10) NOT NULL,
	"external_version" varchar(10) NOT NULL,
	"process_status" "process_status" NOT NULL,
	"retries" smallint DEFAULT 0 NOT NULL,
	"processed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickers" (
	"external_id" varchar(10) NOT NULL,
	"creator" varchar(44) NOT NULL,
	"featured" boolean NOT NULL,
	"name" varchar(100) NOT NULL,
	"symbol" varchar(10) NOT NULL,
	"image" varchar(255) NOT NULL,
	"curve_type" text NOT NULL,
	"price" integer NOT NULL,
	"volume" integer NOT NULL,
	"market_cap" integer NOT NULL,
	"tvl" integer NOT NULL,
	"completion_percentage" integer NOT NULL,
	"creation_date" timestamp NOT NULL,
	"indexed_date" timestamp NOT NULL
);
