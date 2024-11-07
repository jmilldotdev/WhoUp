import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCurrentUser, getUserProfile } from "@/actions/auth";
import { UserProvider } from "@/providers/UserProvider";
import { UsernameRequiredWrapper } from "@/components/UsernameRequiredWrapper";
import { AuthRequired } from "@/components/auth/AuthRequired";
import { Toaster } from "sonner";
import { GardenObject, getUserGardenObjects } from "@/actions/gardenObjects";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "WhoUp",
  description: "Reprogram your doomscrolling with the mindful monolith.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  let profile = null;
  let gardenObjects: GardenObject[] = [];

  user = await getCurrentUser();
  profile = await getUserProfile(user);
  gardenObjects = await getUserGardenObjects(user?.id);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider
          userId={user?.id}
          username={profile?.username}
          initialGardenObjects={gardenObjects}
        >
          <AuthRequired>
            <UsernameRequiredWrapper>{children}</UsernameRequiredWrapper>
          </AuthRequired>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
