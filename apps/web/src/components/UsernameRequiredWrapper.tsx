"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/UserProvider";
import { UsernameDialog } from "@/components/UsernameDialog";
import { updateUsername } from "@/actions/auth";

export function UsernameRequiredWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username, userId } = useUser();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (userId && !username) {
      setShowDialog(true);
    }
  }, [userId, username]);

  const handleUsernameSet = async (newUsername: string) => {
    if (!userId) return;
    await updateUsername(userId, newUsername);
    // window.location.reload();
  };

  if (showDialog) {
    return (
      <>
        <div className="pointer-events-none opacity-50">{children}</div>
        <UsernameDialog isOpen={true} onUsernameSet={handleUsernameSet} />
      </>
    );
  }

  return <>{children}</>;
}
