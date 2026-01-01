import "./globals.css";
import type { Metadata } from "next";
import { ThemeScript } from "@/components/theme-script";

export const metadata: Metadata = {
  title: "Debug выгорания: 50 историй IT-фениксов",
  description:
    "Книга о выгорании в IT — 50 историй людей, которые нашли силы восстановиться.",
  metadataBase: new URL("https://phoenixbook.dev"),
  openGraph: {
    title: "Debug выгорания: 50 историй IT-фениксов",
    description:
      "Книга о выгорании в IT — 50 историй людей, которые нашли силы восстановиться.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Debug выгорания: 50 историй IT-фениксов",
    description:
      "Книга о выгорании в IT — 50 историй людей, которые нашли силы восстановиться."
  },
  icons: {
    icon: "/phoenix-mark.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
