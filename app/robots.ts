import type { MetadataRoute } from 'next';
import { absoluteUrl, isPreview } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview ? { userAgent: '*', disallow: '/' } : { userAgent: '*', allow: '/', disallow: '/api/' },
    ...(isPreview ? {} : { sitemap: absoluteUrl('/sitemap.xml') }),
  };
}
