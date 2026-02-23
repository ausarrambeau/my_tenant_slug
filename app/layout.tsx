import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Seventeen Portal",
  description: "Test Seventeen client portal",
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
