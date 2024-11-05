"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./settings.module.css";
import { Home } from "lucide-react";

interface User {
  id: string;
  username: string;
  status?: "pending" | "friend";
}

export default function Settings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock search function - replace with actual API call
  const searchUsers = async (query: string) => {
    setIsSearching(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock results - replace with actual API call
    const mockResults = [
      { id: "1", username: query + "_user1" },
      { id: "2", username: query + "_user2" },
      { id: "3", username: query + "_user3" },
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
    setFriends(prevFriends => [...prevFriends, { ...user, status: "friend" }]);
    setSearchResults(prevResults => 
      prevResults.filter(result => result.id !== user.id)
    );
  };

  return (
    <div className={styles.page}>
      <Link href="/">
        <div className={styles.homeButton}>
          <img src="/rock.png" alt="Home" className={styles.homeIcon} />
        </div>
      </Link>

      <div className={styles.container}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search for friends..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
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
          <h2 className={styles.subtitle}>Friends</h2>
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
