import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Orchestrator SaaS - Dashboard",
  description: "Panel de control para tu asistente virtual de WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0f1115] text-gray-100 min-h-screen flex antialiased`}>
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
