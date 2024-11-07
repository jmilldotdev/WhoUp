"use client";
import React from "react";
import { createClient } from "@/lib/supabase/client";

const GoogleLoginButton = () => {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/google/callback`,
        skipBrowserRedirect: isPWA,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    });

    if (error) {
      console.error('OAuth error:', error.message);
      return;
    }

    // Handle PWA case
    if (isPWA && data.url) {
      const popup = window.open(
        data.url,
        '_blank',
        'width=500,height=600,noopener,noreferrer'
      );

      if (popup) {
        const timer = setInterval(() => {
          if (popup.closed) {
            clearInterval(timer);
            // Optionally, you can check the auth state here
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                // Handle successful login
              }
            });
          }
        }, 1000);
      }
    }
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
