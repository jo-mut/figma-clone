import type { Metadata } from "next";
import { Geist, Geist_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Figma Clone",
  description: "Minimalist figma clone using Fabric.js and Liveblocks for real-time collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${workSans.className} bg-primary-grey-200`}>
        <Room>
          {children}
        </Room>
      </body>
    </html>
  );
}
