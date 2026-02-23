import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Fourteen Portal",
  description: "Test Fourteen client portal",
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
