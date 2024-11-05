import { useState } from "react";
import styles from "../app/settings/settings.module.css";

interface User {
  id: string;
  username: string;
  status?: "pending" | "friend";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendSearch({ isOpen, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = async (query: string) => {
    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockResults = [
      { id: "1", username: "user1" },
      { id: "2", username: "user2" },
      { id: "3", username: "user3" },
    ].filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(mockResults);
    setIsSearching(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 2) {
      searchUsers(query);
    } else {
      setSearchResults([]);
    }
  };

  const addFriend = (user: User) => {
    setFriends((prevFriends) => [
      ...prevFriends,
      { ...user, status: "friend" },
    ]);
    setSearchResults((prevResults) =>
      prevResults.filter((result) => result.id !== user.id)
    );
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
        <h2 className={styles.subtitle}>Friends</h2>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search for friends..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
            autoFocus
          />

          <div className={styles.searchResults}>
            {isSearching ? (
              <div className={styles.loading}>Searching...</div>
            ) : (
              searchResults.map((user) => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    <div className={styles.username}>{user.username}</div>
                  </div>
                  <button
                    className={styles.addButton}
                    onClick={() => addFriend(user)}
                  >
                    Add Friend
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.friendsSection}>
          {friends.length === 0 ? (
            <div className={styles.emptyState}>No friends added yet</div>
          ) : (
            <div className={styles.friendsList}>
              {friends.map((friend) => (
                <div key={friend.id} className={styles.friendCard}>
                  <div className={styles.username}>{friend.username}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
