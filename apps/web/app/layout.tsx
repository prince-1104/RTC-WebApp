import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excalidraw – Draw & collaborate",
  description: "Real-time collaborative drawing with pattern detection",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
