import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Golf Swing Analyzer — AI-Powered Swing Analysis",
  description:
    "Upload your golf swing video and receive detailed biomechanical analysis, scoring, and personalized practice drills powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6">
          <div className="mx-auto max-w-6xl px-4 text-center text-xs text-gray-400">
            Golf Swing Analyzer — AI-powered analysis. Not a substitute for professional coaching.
          </div>
        </footer>
      </body>
    </html>
  );
}
