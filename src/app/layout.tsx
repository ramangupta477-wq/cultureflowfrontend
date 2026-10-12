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
          href="https://fonts.googleapis.com/css2?family=Carattere&family=Oranienbaum&family=Inter:wght@300;400;500;600;700&display=swap"
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

