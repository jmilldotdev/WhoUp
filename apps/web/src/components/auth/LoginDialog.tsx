"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import GoogleLoginButton from "./GoogleLoginButton";
import { CONFIG } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginDialog({
  isOpen,
  onOpenChange,
  onAuthComplete,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthComplete: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        onAuthComplete();
        onOpenChange(false);
        setIsEmailLogin(false);
        setEmail("");
        setPassword("");
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [onOpenChange, onAuthComplete]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data.session) {
        onAuthComplete();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Welcome to WhoUp</h2>
            <p className="text-sm text-gray-500">Sign in to continue</p>
          </div>

          {isEmailLogin ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setIsEmailLogin(false)}
                disabled={isLoading}
              >
                Back to other options
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {CONFIG.authMethods.includes("google") && <GoogleLoginButton />}
              
              {CONFIG.authMethods.includes("apple") && (
                <button className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-900">
                  <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
                  Continue with Apple
                </button>
              )}

              {CONFIG.authMethods.includes("email") && (
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsEmailLogin(true)}
                >
                  Continue with Email
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 