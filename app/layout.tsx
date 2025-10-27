import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snowball Debt Calculator",
  description: "Calculate your debt payoff strategy using snowball and avalanche methods",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
