import React, { ReactNode } from "react";
import RootLayoutClient from "./rootLayoutClient";

export const metadata = {
  generator: "v0.dev",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}


import './globals.css'