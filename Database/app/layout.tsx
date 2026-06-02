import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMedia Format & Script Database",
  description: "Central SaaS platform for formats, scripts, run-of-show documents and pitch decks."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className="dark">
      <body>{children}</body>
    </html>
  );
}
