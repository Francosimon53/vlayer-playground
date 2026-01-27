import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vlayer Playground - HIPAA Compliance Scanner",
  description: "Try vlayer directly in your browser. Paste your code and instantly see HIPAA compliance issues.",
  keywords: ["HIPAA", "compliance", "scanner", "playground", "healthcare", "PHI"],
  openGraph: {
    title: "vlayer Playground",
    description: "Interactive HIPAA compliance scanner - try it in your browser",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}
      >
        {children}
      </body>
    </html>
  );
}
