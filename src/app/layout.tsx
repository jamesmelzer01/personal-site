import type { Metadata } from "next";
import { Overpass, Quicksand } from "next/font/google";
import "./globals.css";
import "../styles/tokens.css";
import "../styles/tokens.semantic.css";
import "../styles/tokens.component.css";
import "../styles/tokens.breakpoints.css";
import "../styles/tokens.typography.css";
import "../styles/motion.css";

const overpass = Overpass({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-overpass",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "James Melzer, User Experience Designer",
  description: "Personal site of James Melzer, UX Designer and Information Architect.",
  icons: { icon: [] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" data-density="default">
      <body className={`${overpass.variable} ${quicksand.variable}`}>
        {children}
      </body>
    </html>
  );
}
