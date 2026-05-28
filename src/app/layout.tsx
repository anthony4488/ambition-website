import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { VisitTracker } from "@/components/VisitTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ambition Sports Performance — Elite Speed Development",
  description:
    "World-class speed development for athletes. Speed School, Football School, and Online Coaching programs designed to unlock your athletic potential.",
  keywords: [
    "speed training",
    "athletic performance",
    "sprint coaching",
    "football speed",
    "sports performance",
    "Sydney",
  ],
  openGraph: {
    title: "Ambition Sports Performance",
    description: "World-class speed development for athletes.",
    url: "https://ambitionsportsperformance.com",
    siteName: "Ambition Sports Performance",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-700 noise-overlay">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <VisitTracker />
      </body>
    </html>
  );
}
