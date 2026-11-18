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
  metadataBase: new URL("https://www.theshadowbridge.com"),
  title: {
    default: "The Shadow Bridge | Trained Shadow Teachers & Home Tutors",
    template: "%s | The Shadow Bridge"
  },
  description: "Connect with trained Shadow Teachers, Home Tutors & Therapists for special needs children across Delhi NCR, Mumbai, Ahmedabad, Hyderabad, Bangalore & Pune.",
  keywords: [
    "shadow teacher",
    "home tutor",
    "special education",
    "child support",
    "inclusive learning",
    "Delhi NCR",
    "Mumbai",
    "Ahmedabad",
    "Hyderabad",
    "Bangalore",
    "Pune",
    "autism tutor",
    "ADHD support",
    "special needs mentor",
    "shadow teacher near me",
    "hire shadow teacher India",
    "special needs home tutor",
    "autism shadow teacher cost",
    "ADHD classroom assistant",
    "IEP guidance India",
    "inclusive education assistance",
    "shadow teacher jobs India",
    "learning disability tutor",
    "down syndrome shadow teacher",
    "school permission shadow teacher",
    "Pratibha Mishra shadow bridge"
  ],
  alternates: {
    canonical: "https://www.theshadowbridge.com"
  },
  openGraph: {
    title: "The Shadow Bridge | Shadow Teachers & Special Education Tutors",
    description: "Empowering children with academic, behavioral, and inclusive support. Serving families across Delhi NCR, Mumbai, Ahmedabad, Hyderabad, Bangalore & Pune.",
    url: "https://www.theshadowbridge.com",
    siteName: "The Shadow Bridge",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://www.theshadowbridge.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Shadow Bridge - Certified Shadow Teachers & Special Education Tutors"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Shadow Bridge | Shadow Teachers & Tutors",
    description: "Connecting families with verified Shadow Teachers & Special Education Tutors in Delhi NCR, Mumbai, Ahmedabad, Hyderabad, Bangalore & Pune.",
    images: ["https://www.theshadowbridge.com/og-image.png"]
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

import ScrollToTop from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.theshadowbridge.com/#website",
        "url": "https://www.theshadowbridge.com",
        "name": "The Shadow Bridge",
        "inLanguage": "en-IN",
        "publisher": { "@id": "https://www.theshadowbridge.com/#organization" }
      },
      {
        "@type": ["EducationalOrganization", "LocalBusiness"],
        "@id": "https://www.theshadowbridge.com/#organization",
        "name": "The Shadow Bridge",
        "url": "https://www.theshadowbridge.com",
        "sameAs": [
          "https://www.instagram.com/the_shadow_bridge",
          "https://www.linkedin.com/in/pratibha-mishra-3992042ab/"
        ],
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.theshadowbridge.com/favicon-512.png",
          "width": 512,
          "height": 512
        },
        "image": {
          "@type": "ImageObject",
          "url": "https://www.theshadowbridge.com/og-image.png",
          "width": 1200,
          "height": 630
        },
        "description": "Connecting families with professionally trained Shadow Teachers, Special Education Home Tutors, and Therapists across Delhi NCR, Mumbai, Ahmedabad, Hyderabad, Bangalore & Pune.",
        "founder": {
          "@type": "Person",
          "@id": "https://www.theshadowbridge.com/founder-story#pratibha-mishra",
          "name": "Pratibha Mishra",
          "jobTitle": "Founder & Lead Educational Mentor",
          "url": "https://www.theshadowbridge.com/founder-story",
          "sameAs": ["https://www.linkedin.com/in/pratibha-mishra-3992042ab/"]
        },
        "email": "theshadowbridgesupport@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "theshadowbridgesupport@gmail.com",
          "availableLanguage": ["English", "Hindi"],
          "areaServed": "IN"
        },
        "priceRange": "₹99 - ₹5000",
        "areaServed": [
          { "@type": "City", "name": "Delhi NCR" },
          { "@type": "City", "name": "Mumbai" },
          { "@type": "City", "name": "Ahmedabad" },
          { "@type": "City", "name": "Hyderabad" },
          { "@type": "City", "name": "Bangalore" },
          { "@type": "City", "name": "Pune" },
          { "@type": "Country", "name": "India" }
        ],
        "knowsAbout": [
          "Shadow Teacher Support",
          "Special Education Home Tutoring",
          "Inclusive Classroom Assistance",
          "Behavioral Management & Autism/ADHD Support",
          "ABA Online Therapy & Parent Training",
          "Individualized Education Program (IEP)",
          "Down Syndrome & Learning Disability Support",
          "Shadow Teacher Jobs & Training"
        ]
      }
    ]
  };

  const speculationRules = {
    prefetch: [
      {
        source: "list",
        urls: ["/book", "/services", "/therapies", "/schools", "/resources", "/shadow-teachers", "/tutors"],
        eagerness: "moderate"
      }
    ]
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="apple-touch-icon" href="/favicon-192.png" />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=document.documentElement;if(localStorage.getItem('theme')==='dark'){d.classList.add('dark')}}catch(e){}})();`
          }}
        />
      </head>
      <body className="font-sans antialiased relative">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="speculationrules"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
        />
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
