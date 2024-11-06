"use server";

import { createClient } from "@/lib/supabase/server";

export async function createConnection(
  userId: string,
  connectedUserId: string,
  assetUrl?: string
) {
  const supabase = await createClient();

  const { data: connection, error } = await supabase
    .from("Connections")
    .insert([
      {
        user_id: userId,
        connected_user_id: connectedUserId,
        asset_url: assetUrl,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return connection;
}
