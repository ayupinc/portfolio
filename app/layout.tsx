import type { Metadata } from "next";
import { AccessGate } from "./access-gate";
import { Footer, Header } from "./components";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mapleintel.uk"),
  title: {
    default: "Maple Leaf Intelligence | Operational analytics for health services",
    template: "%s | Maple Leaf Intelligence",
  },
  description:
    "Independent Power BI and analytics engineering consultancy for ambulance services, the wider NHS and complex operational environments.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Maple Leaf Intelligence",
    description:
      "Operational analytics and Power BI for ambulance services and the wider NHS.",
    type: "website",
    url: "https://mapleintel.uk",
    images: [
      {
        url: "/og.png",
        width: 1734,
        height: 907,
        alt: "Maple Leaf Intelligence — Operational analytics for services where the detail matters.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple Leaf Intelligence",
    description:
      "Operational analytics and Power BI for ambulance services and the wider NHS.",
    images: ["/og.png"],
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <AccessGate>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </AccessGate>
      </body>
    </html>
  );
}
