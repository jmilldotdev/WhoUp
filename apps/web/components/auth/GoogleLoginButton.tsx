"use client";
import React from "react";
import { createClient } from "../../lib/supabase/client";

const GoogleLoginButton = () => {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://localhost:3000/api/auth/google/callback",
      },
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
