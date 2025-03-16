import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farcaster Chat Bot",
  description: "AI-powered chat assistant for Farcaster",
  other: {
    // Farcaster Frame meta tag - required for Frame detection
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/img.png",
      button: {
        title: "Start Chat",
        action: {
          type: "launch_frame",
          name: "Farcaster Chat Bot",
          url: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/",
          splashImageUrl: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/chat.png",
          splashBackgroundColor: "#4F46E5"
        }
      }
    })
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Manually add Farcaster Frame meta tag as fallback */}
        <meta name="fc:frame" content={JSON.stringify({
          version: "1",
          imageUrl: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/img.png",
          button: {
            title: "Start Chat",
            action: {
              type: "launch_frame",
              name: "Farcaster Chat Bot",
              url: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/",
              splashImageUrl: "https://farcaster-chat-bot-git-main-0xlimons-projects.vercel.app/chat.png",
              splashBackgroundColor: "#4F46E5"
            }
          }
        })} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
