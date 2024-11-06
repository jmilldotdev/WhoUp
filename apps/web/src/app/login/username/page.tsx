import { redirect } from "next/navigation";
import { getUserProfile } from "@/actions/auth";
import { UsernameSetup } from "@/components/UsernameSetup";

export default async function UsernamePage() {
  const profile = await getUserProfile();

  if (profile?.username) {
    redirect("/");
  }

  return <UsernameSetup />;
}
