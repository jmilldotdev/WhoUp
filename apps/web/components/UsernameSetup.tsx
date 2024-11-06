"use client";

import { useState } from "react";
import { updateProfile } from "../actions/auth";

export function UsernameSetup() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    const username = formData.get("username") as string;
    if (username.length > 32) {
      setError("Username must be 32 characters or less");
      return;
    }

    const result = await updateProfile(formData);
    if (result.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Choose your username
          </h2>
        </div>
        <form action={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              id="username"
              name="username"
              type="text"
              required
              maxLength={32}
              className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300"
              placeholder="Username"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
