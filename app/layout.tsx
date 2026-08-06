import type { Metadata } from "next";
import { Footer, Header } from "./components";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mapleintel.uk"),
  title: "Maple Leaf Intelligence | Operational intelligence for health services",
  description:
    "Maple Leaf Intelligence helps NHS and health-service teams understand demand, flow, capacity and performance, and turn complex operational information into practical decision support.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/assets/maple-leaf.png",
    shortcut: "/assets/maple-leaf.png",
    apple: "/assets/maple-leaf.png",
  },
  openGraph: {
    title: "Maple Leaf Intelligence",
    description:
      "See the operational picture. Make the next decision with confidence.",
    type: "website",
    url: "https://mapleintel.uk",
    siteName: "Maple Leaf Intelligence",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Maple Leaf Intelligence - operational intelligence for health services.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple Leaf Intelligence",
    description:
      "See the operational picture. Make the next decision with confidence.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
