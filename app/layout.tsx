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
        url: "/logo.png", // Website preview image
        width: 1200,
        height: 630,
        alt: "FYT LYF",
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

  // ⭐ THIS controls what Google shows as favicon
  icons: {
    icon: "/brandicon.png",
    shortcut: "/brandicon.png",
    apple: "/brandicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Brand Organization Schema - Helps Google show correct branding */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FYT LYF",
              url: "https://fytlyf.in",
              logo: "https://fytlyf.in/brandicon.png",
            }),
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
