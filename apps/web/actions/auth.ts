"use server";

import { createClient } from "../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // Check if user has profile
  const user = await getCurrentUser();
  if (!user) redirect("/error");

  const { data: profile } = await supabase
    .from("Profiles")
    .select("username")
    .eq("user_id", user.id)
    .single();

  revalidatePath("/", "layout");

  // Redirect to username setup if no profile exists
  if (!profile?.username) {
    redirect("/login/username");
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/login/username");
}

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const username = formData.get("username") as string;

  const { error } = await supabase.from("Profiles").upsert({
    user_id: user.id,
    username,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function getUserProfile() {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from("Profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}
