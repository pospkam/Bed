import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "KAMHUB - Агрегатор туров на Камчатку",
  description: "Бронирование туров на Камчатке: рыбалка, вулканы, походы. Лучшие цены и проверенные операторы.",
  keywords: "Камчатка, туры, рыбалка, вулканы, бронирование",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
