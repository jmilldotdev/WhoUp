import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getCurrentUser, getUserProfile } from "@/actions/auth";
import { UserProvider } from "@/providers/UserProvider";
import { UsernameRequiredWrapper } from "@/components/UsernameRequiredWrapper";

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
  const profile = await getUserProfile(user);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider userId={user?.id} username={profile?.username}>
          <UsernameRequiredWrapper>{children}</UsernameRequiredWrapper>
        </UserProvider>
      </body>
    </html>
  );
}
