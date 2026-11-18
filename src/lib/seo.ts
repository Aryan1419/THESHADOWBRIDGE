import type { Metadata } from 'next';

export const SITE_URL = 'https://www.theshadowbridge.com';
export const SITE_NAME = 'The Shadow Bridge';
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'The Shadow Bridge — Shadow Teachers, Home Tutors & Special Needs Therapy across India',
};

interface PageMetadataInput {
  /** Page title WITHOUT the "| The Shadow Bridge" suffix (auto-appended by root template). Aim for <= 40 chars. */
  title: string;
  /** Meta description (target 125–158 characters). */
  description: string;
  /** Canonical path starting with "/" (e.g. "/services"). */
  path: string;
  /** OpenGraph type (defaults to "website"). */
  type?: 'website' | 'article';
  /** Optional custom OG image override. */
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  /** Optional absolute title override (skips root template). */
  absoluteTitle?: string;
  /** Optional robots noindex flag. */
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  type = 'website',
  image,
  absoluteTitle,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath}`;
  const ogImage = image
    ? {
        url: image.url.startsWith('http') ? image.url : `${SITE_URL}${image.url}`,
        width: image.width ?? 1200,
        height: image.height ?? 630,
        alt: image.alt ?? `${title} | ${SITE_NAME}`,
      }
    : DEFAULT_OG_IMAGE;

  const fullTitle = absoluteTitle || `${title} | ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
  };
}
