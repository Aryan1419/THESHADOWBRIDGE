import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why I Started The Shadow Bridge | Our Story",
  description: "The story behind The Shadow Bridge by Founder Pratibha Mishra. Connecting neurodivergent children with verified Shadow Teachers and Tutors.",
  alternates: {
    canonical: "https://www.theshadowbridge.com/founder-story"
  }
};

export default function OurStoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
