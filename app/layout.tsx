import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Fifteen Portal",
  description: "Test Fifteen client portal",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="tenant-body">{children}</body>
    </html>
  );
}
