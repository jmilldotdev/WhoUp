"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateBroadcastParams {
  userId: string;
  topic: string;
  isPublic: boolean;
}

export async function createBroadcast({
  userId,
  topic,
  isPublic,
}: CreateBroadcastParams) {
  const supabase = await createClient();

  // Create the broadcast
  const { data: broadcast, error: broadcastError } = await supabase
    .from("Broadcasts")
    .insert([
      {
        user_id: userId,
        topic,
        is_public: isPublic,
        is_targeted: false,
      },
    ])
    .select()
    .single();

  if (broadcastError) throw broadcastError;

  // If private, add BroadcastUsers for friends
  if (!isPublic) {
    // Get user's friends
    const { data: friends, error: friendsError } = await supabase
      .from("UserFriendships")
      .select("friend_id")
      .eq("user_id", userId);

    if (friendsError) throw friendsError;

    // Create BroadcastUsers entries
    if (friends?.length) {
      const broadcastUsers = friends.map((friend) => ({
        broadcast_id: broadcast.id,
        user_id: friend.friend_id,
      }));

      const { error: insertError } = await supabase
        .from("BroadcastUsers")
        .insert(broadcastUsers);

      if (insertError) throw insertError;
    }
  }

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
