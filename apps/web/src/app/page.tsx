import { redirect } from "next/navigation";
import { MoonPhaseViewer } from "@/components/MoonPhaseViewer";
import { getUserProfile } from "@/actions/auth";

export default async function Home() {
  const profile = await getUserProfile();

  if (!profile?.username) {
    redirect("/login/username");
  }

  return <MoonPhaseViewer />;
}
