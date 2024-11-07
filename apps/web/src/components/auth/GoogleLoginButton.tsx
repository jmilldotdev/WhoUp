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

    if (isPWA && data.url) {
      const popup = window.open(
        data.url,
        '_blank',
        'width=500,height=600,noopener,noreferrer'
      );

      if (popup) {
        window.addEventListener('message', (event) => {
          if (event.origin === window.location.origin) {
            // Handle the received message
            console.log('Received auth data:', event.data);
            // Close the popup
            popup.close();
          }
        });
      }
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full font-mono flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50 glow-effect"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
