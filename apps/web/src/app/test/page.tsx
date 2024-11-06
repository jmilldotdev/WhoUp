"use client";

import InstallPrompt from "@/components/InstallPrompt";
import PushNotificationManager from "@/components/PushNotificationManager";
import { BroadcastDialog } from "@/components/BroadcastDialog";

const TestPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="space-y-4">
        <div>TestPage</div>
        <PushNotificationManager />
        <InstallPrompt />
        <BroadcastDialog />
      </div>
    </div>
  );
};

export default TestPage;
