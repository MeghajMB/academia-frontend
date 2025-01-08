import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import StoreProvider from "./StoreProvider";
import Navbar from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import PersistLogin from "@/components/PersistLogin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academia",
  description: "Empower your learning journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-black text-white">
          <StoreProvider>
            <Navbar />
            <PersistLogin>
            {children}
            </PersistLogin>
          </StoreProvider>
        <ToastContainer/>
        </div>
      </body>
    </html>
  );
}
