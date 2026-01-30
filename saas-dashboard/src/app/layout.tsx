import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Dashboard",
  description: "Full Stack SaaS Dashboard with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en"suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
