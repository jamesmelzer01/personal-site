import type { Metadata } from "next";
import { Nixie_One, Quicksand } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";

const nixieOne = Nixie_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nixie-one",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "James Melzer, User Experience Designer",
  description: "Personal site of James Melzer, UX Designer and Information Architect.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nixieOne.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  );
}
