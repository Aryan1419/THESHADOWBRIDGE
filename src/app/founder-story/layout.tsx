import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why I Started The Shadow Bridge | Founder's Story by Pratibha Mishra",
  description: "Learn why Founder Pratibha Mishra created The Shadow Bridge to connect families of neurodivergent children with background-verified Shadow Teachers and Special Needs Tutors.",
  alternates: {
    canonical: "https://theshadowbridge.com/founder-story"
  },
  openGraph: {
    title: "Why I Started The Shadow Bridge | Founder's Story",
    description: "The story behind The Shadow Bridge by Founder Pratibha Mishra. Empowering inclusive learning for children across India.",
    url: "https://theshadowbridge.com/founder-story",
    siteName: "The Shadow Bridge",
    images: [{ url: "/images/founder_pratibha.png", width: 800, height: 800, alt: "Pratibha Mishra - Founder of The Shadow Bridge" }]
  }
};

export default function FounderStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
