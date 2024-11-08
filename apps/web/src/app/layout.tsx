import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCurrentUser, getUserProfile } from "@/actions/auth";
import { UserProvider } from "@/providers/UserProvider";
import { UsernameRequiredWrapper } from "@/components/UsernameRequiredWrapper";
import { AuthRequired } from "@/components/auth/AuthRequired";
import { Toaster } from "sonner";
import { getUserGardenObjects } from "@/actions/gardenObjects";
import { GardenObject } from "@/lib/types";
import { redirect } from "next/navigation";

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
  const user = await getCurrentUser();
  
  // If user is logged in but has no profile/username, force username setup
  if (user) {
    const profile = await getUserProfile(user);
    const gardenObjects = await getUserGardenObjects(user.id);

    // If user exists but no profile/username, still render the app but with UsernameRequiredWrapper
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <UserProvider
            userId={user.id}
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

  // Not logged in case
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider
          userId={undefined}
          username={undefined}
          initialGardenObjects={[]}
        >
          <AuthRequired>
            {children}
          </AuthRequired>
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}
