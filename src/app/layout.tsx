import type { Metadata } from "next";
import { Carattere } from "next/font/google";
import "./globals.css";
import LenisProvider from "../components/LenisProvider";
import Navbar from "../components/Navbar";

const carattere = Carattere({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-carattere",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Culture Flow — One Step. New Future.",
  description:
    "Transforming Indian student mobility through structured educational programs worldwide.",
  icons: {
    icon: [
      { url: "/homepage_assets/favicon.svg", type: "image/svg+xml" },
      { url: "/homepage_assets/favicon.ico", sizes: "48x48" },
      { url: "/homepage_assets/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/homepage_assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/homepage_assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/homepage_assets/apple-touch-icon.png",
  },
  manifest: "/homepage_assets/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={carattere.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Bricolage+Grotesque:opsz,wght@12..96,600;700;800&family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LenisProvider>
          <Navbar />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}

