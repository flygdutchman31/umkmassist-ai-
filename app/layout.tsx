import type { Metadata } from "next";
import "./globals.css";
import GlassShatter from "./GlassShatter";

export const metadata: Metadata = {
  title: "Ruang — Asisten Produktivitas AI",
  description: "Ruang kerjamu untuk merapikan pikiran, menyusun rencana, dan menyelesaikan tugas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/></head><body>{children}<GlassShatter /></body></html>;
}
