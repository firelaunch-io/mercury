-- First, add a new column with the desired bigint type
ALTER TABLE "processed_transactions" ADD COLUMN "block_time_bigint" bigint;

-- Then, update the new column with the converted values from the existing column
-- We'll use a safe conversion method to handle potential invalid data
UPDATE "processed_transactions"
SET "block_time_bigint" = CASE
    WHEN "block_time" IS NOT NULL THEN EXTRACT(EPOCH FROM "block_time")::bigint
    ELSE NULL
END;

-- Now, drop the old column
ALTER TABLE "processed_transactions" DROP COLUMN "block_time";

-- Finally, rename the new column to the original name
ALTER TABLE "processed_transactions" RENAME COLUMN "block_time_bigint" TO "block_time";

-- Add a comment explaining the migration
COMMENT ON COLUMN "processed_transactions"."block_time" IS 'Converted from timestamp to bigint (Unix timestamp)';