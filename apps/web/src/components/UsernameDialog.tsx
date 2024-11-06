"use client";

import { useState } from "react";
import { useUser } from "@/providers/UserProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  isOpen: boolean;
  onUsernameSet: (username: string) => Promise<void>;
}

export function UsernameDialog({ isOpen, onUsernameSet }: Props) {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onUsernameSet(username);
    } catch (error) {
      console.error("Error setting username:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Username</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              required
              minLength={3}
              maxLength={20}
              pattern="^[a-zA-Z0-9_-]+$"
              title="Username can only contain letters, numbers, underscores, and hyphens"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Setting..." : "Set Username"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 