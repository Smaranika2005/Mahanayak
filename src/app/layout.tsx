import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "মহানায়ক",
  description: "Uttam Kumar Tribute Mood Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[var(--color-sepia-dark)] text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
