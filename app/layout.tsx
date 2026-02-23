import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Four Portal",
  description: "Test Four client portal",
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
