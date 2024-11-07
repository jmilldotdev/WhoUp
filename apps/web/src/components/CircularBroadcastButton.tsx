"use client";

import { useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { createBroadcast } from "@/actions/broadcasts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function CircularBroadcastButton() {
  const { userId } = useUser();
  const [isPublic, setIsPublic] = useState(false);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!userId) return;
    e.preventDefault();
    setIsLoading(true);

    try {
      await createBroadcast({
        userId,
        topic,
        isPublic,
      });

      setOpen(false);
      setTopic("");
      setIsPublic(false);
    } catch (error) {
      console.error("Error creating broadcast:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        style={{
          width: "50px",
          height: "50px",
          margin: "10px",
          padding: "0",
          border: "none",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.8)",
          color: "#00ffff",
          cursor: "pointer",
          boxShadow: "0 0 15px 5px rgba(0, 255, 255, 0.5)",
          transition: "background 0.3s, box-shadow 0.3s",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
          e.currentTarget.style.boxShadow = "0 0 20px 10px rgba(0, 255, 255, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
          e.currentTarget.style.boxShadow = "0 0 15px 5px rgba(0, 255, 255, 0.5)";
        }}
      >
        <img
          src="/broadcast.png"
          alt="Broadcast"
          style={{
            width: "100%",
            height: "100%",
            opacity: 0.8,
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.8";
          }}
        />
      </button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Broadcast</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter broadcast topic..."
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public">Make Public</Label>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Broadcast"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 