"use client";

import type React from "react";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { useAuthStore } from "@/store/auth-store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { checkAuth } = useAuthStore();
  const isAuthPage = pathname === "/login";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {!isAuthPage && <Navbar />}
          <main className={isAuthPage ? "" : "pt-0"}>{children}</main>
        </div>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
