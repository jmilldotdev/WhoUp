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

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  const user1 = data?.users[0];
  const user2 = data?.users[1];

  if (!user1 || !user2 || error) {
    throw new Error("No users found");
  }

  // Create a profile for user1
  await supabase.from("Profiles").insert({
    user_id: user1.id,
    username: "user1",
  });

  // Create a profile for user2
  await supabase.from("Profiles").insert({
    user_id: user2.id,
    username: "user2",
  });
}

seedDatabase();
