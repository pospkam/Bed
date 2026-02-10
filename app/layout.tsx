import type { Metadata } from "next";
import { Playfair_Display, Work_Sans } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components/layout";

const playfair = Playfair_Display({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-display',
  weight: ['400', '700', '900'],
  display: 'swap',
});

const workSans = Work_Sans({ 
  subsets: ["latin", "latin-ext"],
  variable: '--font-sans',
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

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
      <body className={`${workSans.variable} ${playfair.variable} font-sans`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
