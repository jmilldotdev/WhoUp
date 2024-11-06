"use client";

import { useState } from "react";
import styles from "@/app/settings/settings.module.css";
import { createFriendRequest } from "@/actions/friendships";
import { useUser } from "@/providers/UserProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded?: () => void;
}

export function FriendSearch({ isOpen, onClose, onFriendAdded }: Props) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!userId) return;
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createFriendRequest(userId, username);
      setUsername("");
      onFriendAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add friend");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`${styles.container} ${styles.overlayContainer}`}>
        <h2 className={styles.subtitle}>Add Friend</h2>
        <form onSubmit={handleSubmit} className={styles.searchSection}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.searchInput}
            autoFocus
          />
          {error && <div className={styles.error}>{error}</div>}
          <button
            type="submit"
            className={styles.addButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Friend"}
          </button>
        </form>
      </div>
    </div>
  );
}
