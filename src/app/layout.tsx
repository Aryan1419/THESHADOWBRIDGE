import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://theshadowbridge.com"),
  title: {
    default: "The Shadow Bridge | Trained Shadow Teachers & Home Tutors",
    template: "%s | The Shadow Bridge"
  },
  description: "Connecting families with professionally trained Shadow Teachers and Home Tutors in Delhi NCR, Ahmedabad, Hyderabad & Bangalore. Special education, behavior support, and inclusive learning assistance.",
  keywords: ["shadow teacher", "home tutor", "special education", "child support", "inclusive learning", "Delhi NCR", "Ahmedabad", "Hyderabad", "Bangalore", "autism tutor", "ADHD support", "special needs mentor"],
  alternates: {
    canonical: "https://theshadowbridge.com"
  },
  openGraph: {
    title: "The Shadow Bridge | Shadow Teachers & Special Education Tutors",
    description: "Empowering children with academic, behavioral, and inclusive support. Serving families across Delhi NCR, Ahmedabad, Hyderabad & Bangalore.",
    url: "https://theshadowbridge.com",
    siteName: "The Shadow Bridge",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/favicon-512.png",
        width: 512,
        height: 512,
        alt: "The Shadow Bridge - Shadow Teachers & Special Education Tutors"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shadow Bridge | Shadow Teachers & Tutors",
    description: "Connecting families with verified Shadow Teachers & Special Education Tutors in Delhi NCR, Ahmedabad, Hyderabad & Bangalore.",
    images: ["/favicon-512.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased text-brand-dark bg-white">
        {children}
      </body>
    </html>
  );
}
