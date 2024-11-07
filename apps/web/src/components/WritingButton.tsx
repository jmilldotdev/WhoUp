"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGardenObject } from "@/actions/gardenObjects";
import { useUser } from "@/providers/UserProvider";
import { toast } from "sonner";

export function WritingButton() {
  const { userId, refreshGardenObjects } = useUser();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [userResponse, setUserResponse] = useState("");

  const prompts = [
    "What's alive in you right now?",
    "What have you explored today?",
    "What's one thing you want to share with your friend?",
    "What made you smile today?",
    "What challenged you today and how did you handle it?",
    "What are you grateful for in this moment?",
    "What's one small win you had today?",
    "What did you learn about yourself today?",
    "What act of kindness did you witness or perform today?",
    "What's one thing you'd like to remember about today?"
  ];

  const openDialog = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const selectedPrompt = prompts[randomIndex] ?? "How was your day?";
    setMessage(selectedPrompt);
    setUserResponse("");
    setOpen(true);
  };

  const handleCreateObject = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }
    if (!userResponse.trim()) {
      toast.error("Please write your reflection first");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createGardenObject(userId, userResponse);
      await refreshGardenObjects();
      toast.success(`Created new ${result.object_component_type}!`);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to create garden object");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        onClick={(event) => {
          event.stopPropagation();
          openDialog();
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
          e.currentTarget.style.boxShadow =
            "0 0 20px 10px rgba(0, 255, 255, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
          e.currentTarget.style.boxShadow =
            "0 0 15px 5px rgba(0, 255, 255, 0.5)";
        }}
      >
        <img
          src="/write.png"
          alt="Gift"
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
            boxShadow:
              "0 0 10px rgba(0, 0, 0, 0.1), 0 0 15px 5px rgba(255, 255, 255, 0.6)",
          }}
        >
          <h2 className="font-mono text-white">Daily Reflection</h2>
          <p className="font-mono font-bold italic text-white mb-4">{message}</p>
          <textarea
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            className="w-full p-2 mb-4 bg-black/30 text-white font-mono border border-white/20 rounded-md"
            rows={4}
            placeholder="Write your reflection here..."
          />
          <div className="font-mono text-center">
            <Button 
              onClick={handleCreateObject} 
              disabled={isCreating || !userResponse.trim()}
            >
              {isCreating ? "Creating..." : "Save Reflection"}
            </Button>
          </div>
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
