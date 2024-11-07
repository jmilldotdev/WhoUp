"use client";

import { useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { createBroadcast } from "@/actions/broadcasts";
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
    <>
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

      {open && (
        <div
          style={{
            position: "fixed",
            top: "200%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: "20px",
            zIndex: 1000,
            width: "200%",
            maxWidth: "600px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1), 0 0 15px 5px rgba(255, 255, 255, 0.6)",
          }}
        >
          <h2 className="font-mono text-white">Create New Broadcast</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-white">
            <div className="space-y-2 font-mono">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter broadcast topic..."
                className="text-white placeholder:text-white"
                required
              />
            </div>
            <div className="flex items-center justify-between font-mono">
              <Label htmlFor="public">Make Public</Label>
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Broadcast"}
              </Button>
            </div>
          </form>
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
} 