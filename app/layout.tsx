import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "FYT LYF — Not Just Fitness. A Discipline Movement.",
  description:
    "Join FYT LYF – India’s most hardcore discipline-first fitness ecosystem. Transformation challenges, performance battles, AI guidance and elite memberships.",

  metadataBase: new URL("https://fytlyf.in"),
  alternates: {
    canonical: "https://fytlyf.in",
  },

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

  icons: {
    icon: "/brandicon.png",
    shortcut: "/brandicon.png",
    apple: "/brandicon.png",
  },

  themeColor: "#FF6A00",
  robots: {
    index: true,
    follow: true,
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
        {/* VIEWPORT */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        {/* BRAND STRUCTURED DATA */}
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

        {/* GOOGLE ANALYTICS – BEST PRACTICE APP ROUTER */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>

      <body>{children}</body>
    </html>
  );
}
