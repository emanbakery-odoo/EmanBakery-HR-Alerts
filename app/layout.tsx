import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmanBakery HR Alerts",
  description: "HR Alert Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
