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
      <DialogContent
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: "20px",
          zIndex: 1000,
          width: "90%",
          maxWidth: "400px",
          boxShadow:
            "0 0 10px rgba(0, 0, 0, 0.1), 0 0 15px 5px rgba(255, 255, 255, 0.6)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white font-mono">
            Set Your Username
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-white font-mono">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              required
              minLength={3}
              maxLength={20}
              title="Username can only contain letters, numbers, underscores, and hyphens"
              className="bg-white text-black border-none rounded-md p-2 w-full font-mono"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="w-full font-mono" disabled={isLoading} >
              {isLoading ? "Setting..." : "Set Username"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
