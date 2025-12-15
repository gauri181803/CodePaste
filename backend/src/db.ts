import "dotenv/config";
import postgres from "postgres";
import logger from "./logger";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  logger.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, {
  ssl: DATABASE_URL.includes("supabase") ? "require" : false,
  max: 5,
  idle_timeout: 20,
});

export default sql;
