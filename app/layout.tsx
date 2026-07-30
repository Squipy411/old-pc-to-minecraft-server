import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://old-pc-to-minecraft-server.vercel.app"),
  title: { default: "Old PC to Minecraft Server", template: "%s · Old PC to Minecraft Server" },
  description: "A complete beginner guide to turning an unused PC into a self-hosted Fabric Minecraft Java server with ZimaOS and Crafty Controller.",
  openGraph: { title: "Turn an old PC into a real Minecraft server", description: "ZimaOS → Crafty → Fabric → friends join. A complete beginner field guide.", type: "website", images: [{ url: "/og.jpg", width: 600, height: 315, alt: "Old PC to Minecraft Server beginner guide" }] },
  twitter: { card: "summary_large_image", title: "Old PC to Minecraft Server", description: "The complete beginner field guide.", images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
