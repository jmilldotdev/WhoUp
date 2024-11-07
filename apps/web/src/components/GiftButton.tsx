"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createGardenObject } from "@/actions/gardenObjects";
import { useUser } from "@/providers/UserProvider";
import { toast } from "sonner";

export function GiftButton() {
  const { userId, refreshGardenObjects } = useUser();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const messages = [
    "Number 7 will be very important to you for the next 3 hours.",
    "List all your options, reverse them, and pick the number 3 from the button.",
    "You're missing a very specific daily routine that will be a great add to your mental health.",
    "A surprise encounter will bring joy to your day.",
    "Your hard work will soon pay off in unexpected ways.",
    "An opportunity to travel is on the horizon.",
    "Someone close to you has a secret to share.",
    "A new hobby will bring you immense satisfaction.",
    "Trust your instincts; they will guide you well.",
    "A financial opportunity is coming your way."
  ];

  const openDialog = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    const selectedMessage = messages[randomIndex] ?? "Default message";
    setMessage(selectedMessage);
    setOpen(true);
  };

  const handleCreateObject = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createGardenObject(userId, message);
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
          src="/gift.png"
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
          <h2 className="font-mono text-white">Claim Your Prophecy</h2>
          <style>
            {`
              @keyframes rainbow {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
            `}
          </style>
          <p
            className="font-mono text-white"
            style={{
              textAlign: "center",
              marginTop: "10px",
              background: "linear-gradient(90deg, rgba(255,0,0,0.5), rgba(255,154,0,0.5), rgba(208,222,33,0.5), rgba(79,220,74,0.5), rgba(63,218,216,0.5), rgba(47,201,226,0.5), rgba(28,127,238,0.5), rgba(95,21,242,0.5), rgba(186,12,248,0.5), rgba(251,7,217,0.5), rgba(255,0,0,0.5))",
              backgroundSize: "200% 100%",
              animation: "rainbow 5s linear infinite",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            {message}
          </p>
          <div
            className="font-mono"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <Button 
              onClick={handleCreateObject}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Claim Gift"}
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
