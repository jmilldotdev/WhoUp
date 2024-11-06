import { CONFIG } from "../../lib/config";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import Link from "next/link";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Welcome! Let's get started
          </h2>
        </div>
        <div className="space-y-4">
          {CONFIG.authMethods.includes("google") && (
            <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-50">
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
          )}

          {CONFIG.authMethods.includes("apple") && (
            <button className="w-full flex items-center justify-center gap-2 bg-black text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-900">
              <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
              Continue with Apple
            </button>
          )}

          {CONFIG.authMethods.includes("email") && (
            <Link
              href="/login/email"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-md px-3 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Continue with Email
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
