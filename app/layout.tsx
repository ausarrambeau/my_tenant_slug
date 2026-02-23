import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Ten Portal",
  description: "Test Ten client portal",
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
