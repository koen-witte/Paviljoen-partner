import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paviljoen Partner | Beheerplatform",
  description: "Centraal beheerplatform voor strandpaviljoens - CRM, dealflow, documenten en analyses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
