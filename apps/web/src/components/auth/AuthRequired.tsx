"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoginDialog } from "./LoginDialog";
import { useUser } from "@/providers/UserProvider";

export function AuthRequired({ children }: { children: React.ReactNode }) {
  const { userId } = useUser();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthChecking(false);
    setShowLoginDialog(!session);
    setIsAuthenticated(!!session);
  };

  useEffect(() => {
    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setShowLoginDialog(false);
        setIsAuthenticated(true);
      } else if (event === "SIGNED_OUT") {
        setShowLoginDialog(true);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthChecking) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={!isAuthenticated ? "auth-required-blur" : ""}>
        {children}
      </div>
      <LoginDialog
        isOpen={showLoginDialog}
        onOpenChange={(open) => {
          if (!open && isAuthenticated) {
            setShowLoginDialog(false);
          }
        }}
        onAuthComplete={() => {
          setIsAuthenticated(true);
          setShowLoginDialog(false);
          window.location.reload();
        }}
      />
    </>
  );
}
