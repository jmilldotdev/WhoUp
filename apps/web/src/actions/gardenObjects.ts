"use server";

import { createClient } from "@/lib/supabase/server";
import { FLOWER_TYPES } from "@/lib/types";

export type GardenObject = {
  id: string;
  created_at: string;
  object_component_type: string;
  object_scene_position: string | null;
  user_id: string;
};

export async function createGardenObject(userId: string) {
  const supabase = await createClient();

  const randomType = FLOWER_TYPES[
    Math.floor(Math.random() * FLOWER_TYPES.length)
  ] as string;

  const { data, error } = await supabase
    .from("GardenObjects")
    .insert([
      {
        user_id: userId,
        object_component_type: randomType,
        object_scene_position: null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserGardenObjects(userId?: string) {
  if (!userId) return [];
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("GardenObjects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as GardenObject[];
}
