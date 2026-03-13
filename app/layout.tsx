import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traininsight — AI-assistent voor Trainin-ondernemers",
  description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen. Direct inzicht uit je Trainin data — zonder dashboards, filters of rapporten.",
  keywords: ["Trainin", "AI", "omzet", "analytics", "fitness", "sportschool", "boekingen", "inzicht"],
  authors: [{ name: "De AI Strateeg", url: "https://deaistrateeg.nl" }],
  robots: "index, follow",
  openGraph: {
    title: "Traininsight — AI-assistent voor Trainin-ondernemers",
    description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen — rechtstreeks uit Trainin. Geen dashboards, gewoon antwoorden.",
    type: "website",
    locale: "nl_NL",
    siteName: "Traininsight",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traininsight — AI voor Trainin-ondernemers",
    description: "Stel vragen over je bedrijf in gewoon Nederlands. Direct inzicht uit je Trainin data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" style={{ colorScheme: 'dark' }}>
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#050d1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
