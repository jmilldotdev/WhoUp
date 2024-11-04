import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { Database } from "./schema.gen";

dotenv.config();

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

const supabaseAdmin = createClient<Database>(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

async function seedDatabase() {
  console.log("Seeding database...");
}

seedDatabase();
