import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import StoreProvider from "./StoreProvider";
import Navbar from "@/components/navbar/Navbar";
import { ToastContainer } from "react-toastify";
import PersistLogin from "@/hoc/PersistLogin";
import { Providers } from "./Providers";

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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-black text-white">
            <StoreProvider>
              <Navbar />
              <PersistLogin>{children}</PersistLogin>
            </StoreProvider>
            <ToastContainer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
