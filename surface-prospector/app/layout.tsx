import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ToastProvider from "./components/ToastProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Surface Prospector",
  description: "Surface Prospector — AI-driven B2B SaaS prospecting dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-ink text-text-primary`}>
        <ToastProvider>
          <div className="min-h-screen flex bg-ink text-text-primary">
            <Sidebar />
            <div className="flex-1 min-w-0">
              <Header />
              <main className="px-6 py-6 fade-in">{children}</main>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
