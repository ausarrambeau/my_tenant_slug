import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Eight Portal",
  description: "Test Eight client portal",
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
