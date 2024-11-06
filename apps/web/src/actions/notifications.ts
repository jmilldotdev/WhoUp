"use server";

import { createClient } from "@/lib/supabase/server";
import webpush from "web-push";

// Initialize web-push with your VAPID keys
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// Add this type to handle the subscription keys
interface PushSubscriptionWithKeys extends PushSubscription {
  keys?: {
    p256dh: string;
    auth: string;
  };
}

export async function createNotification(
  userId: string,
  title: string,
  body: string,
  type: string,
  actionUrl?: string,
  data?: any
) {
  const supabase = await createClient();

  // Create notification record
  const { data: notification, error } = await supabase
    .from("Notifications")
    .insert([
      {
        user_id: userId,
        title,
        body,
        type,
        action_url: actionUrl,
        data,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Send push notification to all user's subscriptions
  await sendPushNotification(userId, title, body, data);

  return notification;
}

export async function sendPushNotification(
  userId: string,
  title: string,
  body: string,
  data?: any
) {
  const supabase = await createClient();

  console.log("userId", userId);

  // Get all active push subscriptions for the user
  const { data: subscriptions } = await supabase
    .from("PushSubscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  console.log("Subscriptions", subscriptions);

  if (!subscriptions) return;

  // Send push notification to each subscription
  const notifications = subscriptions.map(async (sub) => {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      console.log("Sending push notification to", pushSubscription);
      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify({
          title,
          body,
          data,
        })
      );
    } catch (error) {
      // If subscription is invalid, mark it as inactive
      if ((error as any).statusCode === 410) {
        await supabase
          .from("PushSubscriptions")
          .update({ is_active: false })
          .eq("id", sub.id);
      }
      console.error("Error sending push notification:", error);
    }
  });

  await Promise.all(notifications);
}

// Update the savePushSubscription function to use the correct type
export async function savePushSubscription(
  userId: string,
  subscription: PushSubscriptionWithKeys
) {
  const supabase = await createClient();

  const { endpoint, keys } = subscription;

  if (!keys) throw new Error("Subscription keys are required");

  const { error } = await supabase.from("PushSubscriptions").upsert(
    {
      user_id: userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      is_active: true,
    },
    {
      onConflict: "endpoint",
      ignoreDuplicates: false,
    }
  );

  if (error) throw error;
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("Notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) throw error;
}
