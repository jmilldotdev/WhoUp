import { redirect } from "next/navigation";
import { MoonPhaseViewer } from "@/components/MoonPhaseViewer";
import { getUserProfile } from "@/actions/auth";
import { UserProvider } from "@/providers/UserProvider";

export default async function Home() {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile?.username) {
    redirect("/login/username");
  }

  return (
    <UserProvider userId={profile.user_id} username={profile.username}>
      <MoonPhaseViewer />
    </UserProvider>
  );
}
