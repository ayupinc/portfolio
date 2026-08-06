import type { Metadata } from "next";
import { Footer, Header } from "./components";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mapleintel.uk"),
  title: "Maple Leaf Intelligence | Intelligent reporting for NHS operations",
  description:
    "Maple Leaf Intelligence develops operational reporting for NHS services, with a focus on demand, flow, capacity and performance.",
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
      "Intelligent reporting for NHS operations.",
    type: "website",
    url: "https://mapleintel.uk",
    siteName: "Maple Leaf Intelligence",
    images: [
      {
        url: "/og.png",
        width: 1732,
        height: 908,
        alt: "Maple Leaf Intelligence - intelligent reporting for NHS operations.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maple Leaf Intelligence",
    description: "Intelligent reporting for NHS operations.",
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
