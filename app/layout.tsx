import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FYT LYF — Not Just Fitness. A Discipline Movement.",
  description:
    "Join FYT LYF – India’s most hardcore fitness revolution. Transformation challenges, discipline-based performance battles & powerful fitness memberships.",
  
  metadataBase: new URL("https://fytlyf.in"),

  openGraph: {
    title: "FYT LYF — A Discipline Movement",
    description:
      "A powerful fitness revolution with transformation challenges, performance battles & elite memberships.",
    url: "https://fytlyf.in",
    siteName: "FYT LYF",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FYT LYF Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "FYT LYF — A Discipline Movement",
    description:
      "India’s most hardcore, discipline-first fitness revolution.",
    images: ["/logo.png"],
  },

  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
