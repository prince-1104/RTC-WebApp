import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Excalidraw Metrics & Patterns",
  description: "Time series and pattern detection visualization",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="nav">
          <a href="/">Overview</a>
          <a href="/metrics">Time series (Prometheus)</a>
          <a href="/patterns">Pattern detection</a>
          <a href="/raw">Raw metrics</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
