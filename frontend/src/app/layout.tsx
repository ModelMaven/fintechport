import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "LoanCraft AI | Institutional Bank Loan Project Report Generator",
  description: "AI-powered preparation of professional credit proposals and project feasibility reports for bank funding.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-background text-brand-textPrimary select-none">
        {children}
      </body>
    </html>
  );
}
