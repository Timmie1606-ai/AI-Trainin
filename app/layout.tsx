import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://traininsight.nl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Traininsight — AI-assistent voor Trainin-ondernemers",
    template: "%s | Traininsight",
  },
  description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen. Direct inzicht uit je Trainin data — zonder dashboards, filters of rapporten.",
  keywords: [
    "Trainin", "Traininsight", "AI assistent", "fitness analytics", "sportschool software",
    "omzet inzicht", "klantanalyse", "boekingen overzicht", "fitness ondernemer",
    "AI voor sportschool", "Trainin data", "bezettingsgraad", "churn rate fitness",
  ],
  authors: [{ name: "De AI Strateeg", url: "https://deaistrateeg.nl" }],
  creator: "De AI Strateeg",
  publisher: "Traininsight",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Traininsight — AI-assistent voor Trainin-ondernemers",
    description: "Vraag in gewoon Nederlands naar je omzet, klanten en boekingen — rechtstreeks uit Trainin. Geen dashboards, gewoon antwoorden.",
    type: "website",
    url: BASE_URL,
    locale: "nl_NL",
    siteName: "Traininsight",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Traininsight — AI-assistent voor Trainin-ondernemers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traininsight — AI voor Trainin-ondernemers",
    description: "Stel vragen over je bedrijf in gewoon Nederlands. Direct inzicht uit je Trainin data.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      'nl-NL': BASE_URL,
    },
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
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#050d1a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Traininsight",
              "description": "AI-assistent voor Trainin-ondernemers. Stel vragen in gewoon Nederlands over je omzet, klanten en boekingen.",
              "url": BASE_URL,
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "EUR",
              },
              "publisher": {
                "@type": "Organization",
                "name": "De AI Strateeg",
                "url": "https://deaistrateeg.nl",
              },
              "inLanguage": "nl-NL",
            }),
          }}
        />
      </head>
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
