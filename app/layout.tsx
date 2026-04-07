import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BlogForge AI — Create Stunning Blogs in Seconds",
  description:
    "AI-powered blog generator. Enter your blog name and topic — get 3 complete markdown articles plus a deployable Next.js blog. No coding required.",
  keywords: ["blog generator", "AI blog", "markdown blog", "Next.js blog", "content generator", "BlogForge"],
  authors: [{ name: "BlogForge AI" }],
  openGraph: {
    title: "BlogForge AI — Create Stunning Blogs in Seconds",
    description: "AI-powered blog generator. Create complete blogs with AI in under 60 seconds.",
    type: "website",
    siteName: "BlogForge AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogForge AI — Create Stunning Blogs in Seconds",
    description: "AI-powered blog generator. Create complete blogs with AI in under 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} h-full scroll-smooth`}>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
