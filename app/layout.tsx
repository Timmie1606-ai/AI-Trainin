import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traininsight — Stel vragen over je bedrijf",
  description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen. Direct inzicht uit je Trainin data, zonder dashboards.",
  openGraph: {
    title: "Traininsight",
    description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen — rechtstreeks uit Trainin.",
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Traininsight",
    description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen — rechtstreeks uit Trainin.",
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
        <link rel="icon" type="image/svg+xml" href="/traininsight-favicon.svg" />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
