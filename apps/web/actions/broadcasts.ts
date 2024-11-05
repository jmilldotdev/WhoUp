"use server";

import { createClient } from "../lib/supabase/server";

export async function createBroadcast(userId: string) {
  const supabase = await createClient();

  const { data: broadcast, error } = await supabase
    .from("Broadcasts")
    .insert([{ user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return broadcast;
}

export async function closeBroadcast(broadcastId: string) {
  const supabase = await createClient();

  const { data: broadcast, error } = await supabase
    .from("Broadcasts")
    .update({ is_active: false })
    .eq("id", broadcastId)
    .select()
    .single();

  if (error) throw error;
  return broadcast;
}
