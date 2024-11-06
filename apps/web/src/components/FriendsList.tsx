"use client";

import { useEffect, useState } from "react";
import { getFriendships } from "@/actions/friendships";
import styles from "@/app/settings/settings.module.css";

interface Friend {
  friend_id: string;
  friend: {
    username: string;
  };
}

interface Props {
  userId: string;
  onRefresh?: () => void;
}

export function FriendsList({ userId }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFriends = async () => {
    try {
      setIsLoading(true);
      const friendships = await getFriendships(userId);
      setFriends(friendships);
    } catch (err) {
      setError("Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
  }, [userId]);

  if (isLoading) return <div>Loading friends...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.friendsSection}>
      <h3 className={styles.subtitle}>Your Friends</h3>
      {friends.length === 0 ? (
        <div className={styles.emptyState}>No friends yet</div>
      ) : (
        <div className={styles.friendsList}>
          {friends.map((friend) => (
            <div key={friend.friend_id} className={styles.friendCard}>
              <div className={styles.username}>{friend.friend.username}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
