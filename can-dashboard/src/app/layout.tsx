import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { FooterProvider } from "../../components/FooterContext";
import ClientLayoutContent from "./ClientLayoutContent";

export const metadata: Metadata = {
  title: "DCU Dashboard",
  description: "Real-time CAN bus data visualization dashboard",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased root-body">
        <FooterProvider>
          <ClientLayoutContent>{children}</ClientLayoutContent>
        </FooterProvider>
      </body>
    </html>
  );
}
