import { MetadataRoute } from "next";
import { getHeroSlugs } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://phoenixbook.dev";
  const heroes = getHeroSlugs().map((slug) => ({
    url: `${baseUrl}/heroes/${slug}`,
    lastModified: new Date()
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...heroes
  ];
}
