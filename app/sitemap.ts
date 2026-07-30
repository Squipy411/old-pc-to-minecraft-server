import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: "https://old-pc-to-minecraft-server.vercel.app", lastModified: new Date("2026-07-29"), changeFrequency: "monthly", priority: 1 }]; }
