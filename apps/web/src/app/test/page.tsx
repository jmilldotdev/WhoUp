"use client";

import InstallPrompt from "@/components/InstallPrompt";
import PushNotificationManager from "@/components/PushNotificationManager";
import { BroadcastDialog } from "@/components/BroadcastDialog";
import { createGardenObject } from "@/actions/gardenObjects";
import { useUser } from "@/providers/UserProvider";
import { useState } from "react";
import { toast } from "sonner";

const TestPage = () => {
  const { userId } = useUser();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateObject = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    try {
      setIsCreating(true);
      const result = await createGardenObject(userId);
      toast.success(`Created new ${result.object_component_type}!`);
    } catch (error) {
      toast.error("Failed to create garden object");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-4">
        <div>TestPage</div>
        <PushNotificationManager />
        <InstallPrompt />
        <BroadcastDialog />

        <button
          onClick={handleCreateObject}
          disabled={isCreating}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating..." : "Create Random Garden Object"}
        </button>
      </div>
    </div>
  );
};

export default TestPage;
