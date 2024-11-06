"use server";

import { createClient } from "@/lib/supabase/server";

export async function createFriendRequest(
  requestingUserId: string,
  friendUsername: string
) {
  const supabase = await createClient();

  // First, find the user by username
  const { data: friendProfile, error: profileError } = await supabase
    .from("Profiles")
    .select("user_id")
    .eq("username", friendUsername)
    .single();

  if (profileError) throw profileError;
  if (!friendProfile) throw new Error("User not found");

  // Create friend request (auto-accepted)
  const { error: requestError } = await supabase.from("FriendRequests").insert({
    requesting_user_id: requestingUserId,
    friend_user_id: friendProfile.user_id,
    accepted_at: new Date().toISOString(),
  });

  if (requestError) throw requestError;

  // Create bidirectional friendship
  const { error: friendshipError } = await supabase
    .from("UserFriendships")
    .insert([
      {
        user_id: requestingUserId,
        friend_id: friendProfile.user_id,
      },
      {
        user_id: friendProfile.user_id,
        friend_id: requestingUserId,
      },
    ]);

  if (friendshipError) throw friendshipError;

  return friendProfile.user_id;
}

export async function getFriendships(userId: string) {
  const supabase = await createClient();

  const { data: friendships, error } = await supabase
    .from("UserFriendships")
    .select(
      `
      friend_id,
      friend:Profiles!UserFriendships_friend_id_fkey(
        username
      )
    `
    )
    .eq("user_id", userId);

  if (error) throw error;
  return friendships;
}
