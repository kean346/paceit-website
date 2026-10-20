import type { MetadataRoute } from 'next';
import { absoluteUrl, indexableRoutes, isPreview } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return isPreview ? [] : indexableRoutes.map(path => ({ url: absoluteUrl(path) }));
}
