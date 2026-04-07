import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ["latin"], variable: '--font-poppins', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: "{{BLOG_NAME}}",
    template: "%s | {{BLOG_NAME}}"
  },
  description: "{{BLOG_TAGLINE}}",
  keywords: {{META_KEYWORDS}},
  authors: [{ name: "{{AUTHOR_NAME}}" }],
  creator: "{{AUTHOR_NAME}}",
  openGraph: {
    type: "website",
    siteName: "{{BLOG_NAME}}",
    title: "{{BLOG_NAME}}",
    description: "{{BLOG_TAGLINE}}",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="{{LANG}}" className={`${inter.variable} ${poppins.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
