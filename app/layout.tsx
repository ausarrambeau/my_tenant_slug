import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Twelve Portal",
  description: "Test Twelve client portal",
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
