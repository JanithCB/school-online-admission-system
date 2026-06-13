import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NF Admissions | School Online Admission System",
  description:
    "Apply online for admission to our school. A simple, fast, and paperless admission process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f9f9f7] text-[#1a1a1a]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#e5e5e0] py-8 mt-16">
          <div className="max-w-7xl mx-auto px-6 text-center text-sm text-[#888882]">
            © {new Date().getFullYear()} Nordic Foundation School Admission System. Built as an internship assessment project.
          </div>
        </footer>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
